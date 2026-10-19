import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './helpers/load-typescript.mjs';
const { normalizeItems, quoteSummary } = await loadTypescript('src/lib/quote-items.ts');
const { productSelections, matchesBudget } = await loadTypescript('src/lib/data/products.ts');
const { catalogueCollections, catalogues, catalogueSizeMB } = await loadTypescript('src/lib/data/catalogues.ts');
const { SubmissionGuard, limitedFormData } = await loadTypescript('src/lib/server/submissions.ts');

test('shortlist rejects unknown IDs, fractional quantities and unrelated stored data', () => {
	assert.deepEqual(normalizeItems([{ id: 'notebooks', quantity: 25, email: 'must-not-be-stored' }, { id: 'invented', quantity: 20 }, { id: 'caps', quantity: 1.5 }, { id: 't-shirts', quantity: 0 }]), [{ id: 'notebooks', quantity: 25 }]);
	assert.deepEqual(normalizeItems({ id: 'notebooks', quantity: 1 }), []);
	assert.deepEqual(normalizeItems([{ id: 'notebooks', quantity: 1 }, { id: 'notebooks', quantity: 50 }]), [{ id: 'notebooks', quantity: 50 }]);
});
test('quote summary retains independent per-product quantities', () => {
	assert.equal(quoteSummary([{ id: 'notebooks', quantity: 120 }, { id: 't-shirts', quantity: 50 }]), 'Notebooks — 120 units\nT-Shirts — 50 units');
});
test('budget filters never classify unpriced product types or invent package prices', () => {
	assert.equal(productSelections.length, 10);
	assert.deepEqual(productSelections.filter((p) => matchesBudget(p, 'under-500')).map((p) => p.price), [499]);
	assert.deepEqual(productSelections.filter((p) => matchesBudget(p, '500-1000')).map((p) => p.price), [999]);
	assert.equal(productSelections.filter((p) => matchesBudget(p, '1000-2000')).length, 0);
	assert.equal(productSelections.filter((p) => p.price !== null).length, 2);
});
test('catalogue grouping retains every original ID and hides historical empty download actions', () => {
	assert.equal(catalogues.length, 97);
	assert.equal(catalogueCollections.length, 92);
	assert.equal(catalogueCollections.filter((file) => file.available).length, 85);
	assert.equal(catalogueCollections.filter((file) => file.possibleDuplicate).length, 5);
	assert.equal(new Set(catalogueCollections.flatMap((file) => file.sources.map((source) => source.id))).size, 97);
	assert.equal(catalogues.filter((file) => file.status === 'request-copy').length, 7);
});
test('concurrent submissions and retries share a single confirmed delivery', async () => {
	const guard = new SubmissionGuard(); let calls = 0;
	const send = async () => { calls++; await new Promise((resolve) => setTimeout(resolve, 10)); return { success: true, leadId: 'local-1', message: 'accepted' }; };
	const results = await Promise.all([guard.run('key', 'same-payload', send), guard.run('key', 'same-payload', send)]);
	assert.equal(calls, 1); assert.deepEqual(results[0], results[1]);
	assert.equal((await guard.run('key', 'same-payload', send)).leadId, 'local-1');
	await assert.rejects(guard.run('key', 'changed-payload', send), /KEY_REUSED/);
});
test('failed delivery is retryable and rate limit expires', async () => {
	let clock = 0; const guard = new SubmissionGuard(() => clock);
	await assert.rejects(guard.run('key', 'payload', async () => { throw new Error('offline'); }), /offline/);
	assert.equal((await guard.run('key', 'payload', async () => ({ success: true, leadId: 'retry', message: 'accepted' }))).leadId, 'retry');
	for (let i = 0; i < 12; i++) assert.equal(guard.allow('client'), true);
	assert.equal(guard.allow('client'), false); clock = 600001; assert.equal(guard.allow('client'), true);
});
test('streamed form size limit applies even without a Content-Length header', async () => {
	const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
	const data = await limitedFormData(new Request('http://localhost/contact', { method: 'POST', headers, body: 'name=Local+Buyer' }));
	assert.equal(data.get('name'), 'Local Buyer');
	await assert.rejects(limitedFormData(new Request('http://localhost/contact', { method: 'POST', headers, body: 'notes=' + 'a'.repeat(32768) })), /BODY_LIMIT/);
});


test('catalogue size parsing distinguishes KB, MB and GB before warning or sorting', () => {
 assert.ok(catalogueSizeMB('917 KB') < 1);
 assert.equal(catalogueSizeMB('50 MB'), 50);
 assert.equal(catalogueSizeMB('1 GB'), 1024);
 assert.equal(catalogueSizeMB(null), 0);
 assert.ok(catalogues.find(file => file.format === 'PPTX').sizeMB < 1);
});
