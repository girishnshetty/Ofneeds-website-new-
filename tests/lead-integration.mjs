// Tests only a local production preview and a local mock receiver. No business enquiries are sent.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import path from 'node:path';
const root = process.cwd();
let mode = 200;
const deliveries = [];
const receiver = createServer(async (req, res) => {
	let body = '';
	for await (const chunk of req) body += chunk;
	assert.equal(req.headers.authorization, 'Bearer local-test-token');
	deliveries.push(JSON.parse(body));
	res.writeHead(mode, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({ accepted: mode === 200 }));
});
await new Promise((resolve) => receiver.listen(0, '127.0.0.1', resolve));
const receiverPort = receiver.address().port;
const server = spawn(
	process.execPath,
	[
		path.join(root, 'node_modules/vite/bin/vite.js'),
		'preview',
		'--host',
		'127.0.0.1',
		'--port',
		'5180',
		'--strictPort'
	],
	{
		cwd: root,
		env: {
			...process.env,
			LEAD_WEBHOOK_URL: `http://127.0.0.1:${receiverPort}/leads`,
			LEAD_WEBHOOK_TOKEN: 'local-test-token'
		},
		windowsHide: true,
		stdio: ['ignore', 'pipe', 'pipe']
	}
);
let serverLogs = '';
server.stdout.on('data', (data) => (serverLogs += data.toString()));
server.stderr.on('data', (data) => (serverLogs += data.toString()));
const base = 'http://127.0.0.1:5180';
const fields = {
	name: 'Test Buyer',
	company: 'Test Company',
	email: 'buyer@example.test',
	phone: '+91 90000 00000',
	productRequirement: 'Branded notebooks',
	quantity: '100',
	budget: '499',
	deliveryDate: '2026-12-01',
	deliveryCity: 'Bengaluru',
	notes: 'Local integration test',
	source: '/contact'
};
async function submit(values, origin = base) {
	return fetch(base + '/contact?/quote', {
		method: 'POST',
		headers: {
			Origin: origin,
			Accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
			'x-sveltekit-action': 'true'
		},
		body: new URLSearchParams(values)
	});
}
try {
	let ready = false;
	for (let attempt = 0; attempt < 40; attempt++) {
		try {
			const response = await fetch(base + '/contact', { signal: AbortSignal.timeout(500) });
			if (response.ok) {
				ready = true;
				break;
			}
		} catch {}
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	assert.ok(ready, serverLogs);
	const html = await (await fetch(base + '/contact')).text();
	assert.ok(
		html.includes('Complete the brief below to send it to our team.'),
		'Direct form enabled only with configured endpoint'
	);
	// Enhanced SvelteKit actions use HTTP 200 for the transport; action status is in the JSON envelope.
	let response = await submit({ ...fields, email: 'invalid', quantity: '0' });
	let result = await response.json();
	assert.equal(result.status, 400);
	assert.equal(result.type, 'failure');
	assert.equal(deliveries.length, 0, 'Invalid form must not be delivered');
	response = await submit(fields);
	result = await response.json();
	assert.equal(result.status, 200);
	assert.equal(result.type, 'success');
	assert.equal(deliveries.length, 1);
	const lead = deliveries[0];
	assert.ok(lead.leadId);
	assert.ok(lead.createdAt);
	assert.equal(lead.quantity, 100);
	assert.equal(lead.budget, 499);
	assert.equal(lead.status, 'new');
	assert.equal(lead.source, '/contact');
	mode = 500;
	response = await submit(fields);
	result = await response.json();
	assert.equal(result.status, 502);
	assert.equal(result.type, 'failure');
	response = await submit({ ...fields, website: 'spam' });
	assert.equal((await response.json()).status, 400);
	response = await submit(fields, 'https://example.test');
	assert.equal(response.status, 403, 'Cross-origin submission is blocked');
	response = await submit({ ...fields, notes: 'x'.repeat(40000) });
	assert.equal((await response.json()).status, 413);
	response = await fetch(base + '/contact?/quote', {
		method: 'POST',
		headers: {
			Origin: base,
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-sveltekit-action': 'true'
		},
		body: '{}'
	});
	result = await response.json();
	assert.ok(
		[400, 415].includes(result.status ?? response.status),
		'Unsupported form bodies are rejected'
	);
	console.log(
		'Local integration passed: validation, confirmed delivery, structured lead fields, upstream failure, honeypot, CSRF, size limit and malformed body.'
	);
} finally {
	const closed = new Promise((resolve) => server.once('close', resolve));
	server.kill();
	await closed;
	await new Promise((resolve) => receiver.close(resolve));
}
