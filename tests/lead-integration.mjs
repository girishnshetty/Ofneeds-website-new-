// Local production preview + local mock receiver only. No customer enquiries are sent.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import path from 'node:path';
const root = process.cwd();
let mode = 200;
const deliveries = [];
const receiver = createServer(async (req, res) => {
 let body = ''; for await (const chunk of req) body += chunk;
 assert.equal(req.headers.authorization, 'Bearer local-test-token');
 assert.match(req.headers['idempotency-key'], /^[a-f0-9]{64}$/);
 deliveries.push({ lead: JSON.parse(body), key: req.headers['idempotency-key'] });
 res.writeHead(mode, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify({ accepted: mode === 200 }));
});
await new Promise(resolve => receiver.listen(0, '127.0.0.1', resolve));
const server = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '5180', '--strictPort'], {
 cwd: root, env: { ...process.env, LEAD_WEBHOOK_URL: `http://127.0.0.1:${receiver.address().port}/leads`, LEAD_WEBHOOK_TOKEN: 'local-test-token' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe']
});
let serverLogs = ''; server.stdout.on('data', data => serverLogs += data); server.stderr.on('data', data => serverLogs += data);
const base = 'http://127.0.0.1:5180';
const fields = { name: 'Test Buyer', company: 'Test Company', email: 'buyer@example.test', phone: '+91 90000 00000', productRequirement: 'Please advise on notebook covers.', quantity: '120', budget: '499', deliveryDate: '2026-12-01', deliveryCity: 'Bengaluru', notes: 'Local integration test', brandingRequirements: 'Single logo placement; confirm method', selectedProducts: JSON.stringify([{ id: 'notebooks', quantity: 120 }, { id: 't-shirts', quantity: 50 }]), submissionKey: crypto.randomUUID(), source: '/contact' };
async function submit(values, origin = base) { return fetch(base + '/contact?/quote', { method: 'POST', headers: { Origin: origin, Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'x-sveltekit-action': 'true' }, body: new URLSearchParams(values) }); }
try {
 let ready = false;
 for (let attempt = 0; attempt < 80; attempt++) { try { if ((await fetch(base + '/contact', { signal: AbortSignal.timeout(500) })).ok) { ready = true; break; } } catch {} await new Promise(resolve => setTimeout(resolve, 250)); }
 assert.ok(ready, serverLogs);
 const page = await fetch(base + '/contact'); const html = await page.text();
 assert.ok(html.includes('Complete the brief below to send it to our team.'));
 assert.equal(page.headers.get('x-content-type-options'), 'nosniff');
 let response = await submit({ ...fields, email: 'invalid', quantity: '0' });
 assert.equal((await response.json()).status, 400); assert.equal(deliveries.length, 0);
 const first = await (await submit(fields)).json(); assert.equal(first.type, 'success'); assert.equal(first.status, 200); assert.equal(deliveries.length, 1);
 const lead = deliveries[0].lead;
 assert.equal(lead.quantity, 120); assert.equal(lead.budget, 499); assert.equal(lead.status, 'new'); assert.equal(lead.source, '/contact');
 assert.deepEqual(lead.selectedProducts.map(({ id, quantity }) => ({ id, quantity })), [{ id: 'notebooks', quantity: 120 }, { id: 't-shirts', quantity: 50 }]);
 assert.ok(lead.productRequirement.includes('Notebooks — 120 units') && lead.productRequirement.includes('T-Shirts — 50 units'));
 assert.equal(lead.brandingRequirements, fields.brandingRequirements);
 const duplicate = await (await submit(fields)).json(); assert.equal(duplicate.type, 'success'); assert.equal(deliveries.length, 1); assert.deepEqual(duplicate, first);
 assert.equal((await (await submit({ ...fields, notes: 'Changed after confirmed send' })).json()).status, 409);
 mode = 500; const retryFields = { ...fields, submissionKey: crypto.randomUUID() };
 assert.equal((await (await submit(retryFields)).json()).status, 502);
 mode = 200; assert.equal((await (await submit(retryFields)).json()).type, 'success');
 assert.equal(deliveries[1].key, deliveries[2].key, 'Ambiguous/failed delivery retries preserve the upstream key');
 assert.equal((await (await submit({ ...fields, website: 'spam' })).json()).status, 400);
 assert.equal((await submit(fields, 'https://example.test')).status, 403);
 assert.equal((await (await submit({ ...fields, notes: 'x'.repeat(40000) })).json()).status, 413);
 assert.equal((await (await submit({ ...fields, selectedProducts: '[{"id":"invented","quantity":1}]' })).json()).status, 400);
 response = await fetch(base + '/contact?/quote', { method: 'POST', headers: { Origin: base, Accept: 'application/json', 'Content-Type': 'application/json', 'x-sveltekit-action': 'true' }, body: '{}' });
 const malformed = await response.json(); assert.ok([400, 415].includes(malformed.status ?? response.status));
 let limited = false; for (let i = 0; i < 5; i++) { const result = await (await submit(fields)).json(); if (result.status === 429) { limited = true; break; } }
 assert.equal(limited, true); assert.equal(deliveries.length, 3, 'Retries and rejected forms must not deliver extra messages');
 console.log('Passed: confirmed delivery, per-product quantities, branding, duplicate suppression, key conflict, retry, upstream failure, rate limit, malformed/oversized body, unknown product, honeypot, CSRF and response headers.');
} finally {
 const closed = new Promise(resolve => server.once('close', resolve)); server.kill(); await closed; await new Promise(resolve => receiver.close(resolve));
}
