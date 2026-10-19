import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/lib/server/leads.ts', import.meta.url), 'utf8');
const output = ts.transpileModule(source, {
	compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 }
}).outputText;
const { validateLead, webhookReady } = await import(
	'data:text/javascript;base64,' + Buffer.from(output).toString('base64')
);
function form(changes = {}) {
	const values = {
		name: 'Test Buyer',
		company: 'Test Company',
		email: 'buyer@example.test',
		phone: '+91 90000 00000',
		productRequirement: '100 branded notebooks',
		quantity: '100',
		budget: '499',
		deliveryDate: '2026-12-01',
		deliveryCity: 'Bengaluru',
		notes: 'Local automated test',
		source: '/contact',
		...changes
	};
	const data = new FormData();
	for (const [key, value] of Object.entries(values)) data.set(key, value);
	return data;
}
test('valid enquiry retains structured fields and numeric values', () => {
	const parsed = validateLead(form());
	assert.deepEqual(parsed.errors, {});
	assert.equal(parsed.quantity, 100);
	assert.equal(parsed.budget, 499);
	assert.equal(parsed.values.company, 'Test Company');
});
test('required fields, email and phone are validated', () => {
	const parsed = validateLead(
		form({
			name: '',
			company: '',
			email: 'broken',
			phone: 'abc',
			productRequirement: '',
			deliveryCity: ''
		})
	);
	for (const key of ['name', 'company', 'email', 'phone', 'productRequirement', 'deliveryCity'])
		assert.ok(parsed.errors[key]);
});
test('fractional, negative and infinite quantities and budgets are rejected', () => {
	for (const quantity of ['0', '-1', '1.5', 'Infinity', '100000001'])
		assert.ok(validateLead(form({ quantity })).errors.quantity);
	for (const budget of ['-1', 'Infinity', 'invalid'])
		assert.ok(validateLead(form({ budget })).errors.budget);
});
test('optional values can be empty and a zero budget is retained', () => {
	const parsed = validateLead(form({ budget: '', deliveryDate: '' }));
	assert.deepEqual(parsed.errors, {});
	assert.equal(parsed.budget, null);
	assert.equal(validateLead(form({ budget: '0' })).budget, 0);
});
test('invalid dates, excessive text and honeypot submissions are rejected', () => {
	assert.ok(validateLead(form({ deliveryDate: '2026-02-30' })).errors.deliveryDate);
	assert.ok(validateLead(form({ notes: 'a'.repeat(4001) })).errors.notes);
	assert.ok(validateLead(form({ website: 'spam' })).errors.form);
});
test('webhook configuration permits HTTPS and local mocks, rejects unsafe configuration', () => {
	assert.equal(webhookReady('https://example.test/leads'), true);
	assert.equal(webhookReady('http://127.0.0.1:5199/leads'), true);
	for (const url of [
		undefined,
		'',
		'invalid',
		'http://example.test/leads',
		'https://user:password@example.test/leads',
		'file:///tmp/leads'
	])
		assert.equal(webhookReady(url), false);
});
