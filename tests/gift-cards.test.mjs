import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { loadTypescript } from './helpers/load-typescript.mjs';
const { giftPreferences, validGiftLine, restoreGiftBrief, giftBriefText, giftContactHref, giftQueryPrefill } = await loadTypescript('src/lib/gift-cards.ts');
const line = { id: 'shopping', quantity: 100, value: 500, brand: 'Preferred retailer' };
const brief = { lines: [line], occasion: 'Employee recognition' };
const { giftCatalogue, giftCatalogueMeta, browseGiftCards } = await loadTypescript('src/lib/gift-card-catalogue.ts');

test('all 323 listings have valid local logo assets with immutable names and dimensions', () => {
	for (const option of giftCatalogue) {
		assert.ok(option.logo, option.name + ' has a logo');
		assert.match(option.logo.src, /^\/gift-card-logos\/[a-f0-9]{16}\.(png|jpg|webp|gif)$/);
		assert.ok(option.logo.width > 0 && option.logo.height > 0);
		const bytes = fs.readFileSync('static' + option.logo.src);
		assert.ok(bytes.length > 0);
		assert.ok(option.logo.src.includes(crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16)));
	}
	assert.equal(giftCatalogue.find(option => option.name === 'Innovist').logo.dark, true, 'White official Innovist logo has a contrasting plate');
});

test('all 323 source listings and 314 distinct names are retained, including repeated names', () => {
	assert.equal(giftCatalogue.length, 323);
	assert.equal(giftCatalogueMeta.distinctNames, 314);
	assert.equal(new Set(giftCatalogue.map(option => option.id)).size, 323);
	assert.equal(giftCatalogue.filter(option => option.name.toLowerCase() === 'cinepolis').length, 2);
	assert.ok(giftCatalogue.every(option => option.denominations.length && option.denominations.every(value => Number.isInteger(value) && value > 0)));
});

test('brand search, category filtering and face-value sorting retain every listing', () => {
	assert.equal(browseGiftCards('amazon', 'All').length, 2);
	assert.equal(browseGiftCards('no match at all', 'All').length, 0);
	assert.ok(browseGiftCards('', 'Travel').every(option => option.category === 'Travel'));
	assert.equal(browseGiftCards('', 'All').length, 323);
	const ascending = browseGiftCards('', 'All', 'low');
	for (let index = 1; index < ascending.length; index++) assert.ok(Math.min(...ascending[index-1].denominations) <= Math.min(...ascending[index].denominations));
});

test('brand-specific face values, including 50 and 99 INR, survive restore and handoff', () => {
	const elver = giftCatalogue.find(option => option.name === 'Elver');
	const input = { id: elver.id, quantity: 2, value: 50, brand: '' };
	assert.equal(validGiftLine(input), true);
	assert.equal(validGiftLine({ ...input, value: 123 }), false);
	assert.deepEqual(restoreGiftBrief(JSON.stringify({ ...brief, lines: [input] })).lines, [input]);
	assert.match(giftBriefText({ ...brief, lines: [input] }), /Elver/);
	const gaana = giftCatalogue.find(option => option.name === 'Gaana');
	assert.equal(validGiftLine({ ...input, id: gaana.id, value: 99 }), true);
});

test('enquiries remain bounded to five options as the browsable catalogue grows', () => {
	const lines = giftCatalogue.slice(0, 6).map(option => ({ id: option.id, quantity: 1, value: option.denominations[0], brand: '' }));
	assert.equal(giftBriefText({ ...brief, lines }), '');
	assert.equal(restoreGiftBrief(JSON.stringify({ ...brief, lines })).lines.length, 0);
	assert.ok(giftBriefText({ ...brief, lines: lines.slice(0, 5) }).length <= 2000);
});

test('gift-card planning rejects fractional, empty and out-of-range requirements', () => {
	assert.equal(validGiftLine(line), true);
	for (const quantity of [0, -1, 1.5, 10001, NaN, undefined]) assert.equal(validGiftLine({ ...line, quantity }), false);
	for (const value of [99, 500.5, 100001, NaN, undefined]) assert.equal(validGiftLine({ ...line, value }), false);
	assert.equal(validGiftLine({ ...line, id: 'unknown' }), false);
	assert.equal(validGiftLine({ ...line, brand: 'x'.repeat(81) }), false);
});

test('session restore handles corrupt data, invalid lines and duplicate categories', () => {
	assert.deepEqual(restoreGiftBrief(JSON.stringify(brief)), brief);
	for (const raw of [null, '{', '{}', '[]', '{"lines":null}']) assert.equal(restoreGiftBrief(raw).lines.length, 0);
	const restored = restoreGiftBrief(JSON.stringify({ ...brief, lines: [line, line, { ...line, id: 'unknown' }] }));
	assert.equal(restored.lines.length, 1);
	assert.equal(restoreGiftBrief(JSON.stringify({ ...brief, occasion: 'unexpected' })).occasion, 'Employee recognition');
});

test('multi-category handoff keeps voucher quantities and INR face-value totals', () => {
	const input = { ...brief, lines: [line, { id: 'dining', quantity: 20, value: 1000, brand: '' }] };
	const text = giftBriefText(input);
	assert.match(text, /70,000/);
	assert.match(text, /Preferred retailer/);
	assert.match(text, /not a quotation/);
	const url = new URL(giftContactHref(input), 'https://www.ofneeds.com');
	assert.equal(url.pathname, '/contact');
	assert.equal(url.hash, '#quote');
	assert.deepEqual(giftQueryPrefill(url.searchParams), { requirement: text, quantity: '120' });
	assert.equal(giftBriefText({ ...brief, lines: [line, line] }), '');
	assert.equal(giftBriefText({ ...brief, lines: [{ ...line, value: 0 }] }), '');
});

test('largest supported brief fits the existing 2000-character requirement field', () => {
	const input = { occasion: 'x'.repeat(100), lines: giftPreferences.map(option => ({ id: option.id, quantity: 10000, value: 100000, brand: 'x'.repeat(80) })) };
	assert.ok(giftBriefText(input).length <= 2000);
	const url = new URL(giftContactHref(input), 'https://www.ofneeds.com');
	assert.equal(giftQueryPrefill(url.searchParams).quantity, '50000');
});

test('contact prefill is limited to gift-card enquiries and bounded values', () => {
	assert.deepEqual(giftQueryPrefill(new URLSearchParams({ giftBrief: 'Unexpected text', giftQuantity: '100' })), { requirement: '', quantity: '' });
	const params = new URLSearchParams({ interest: 'gift-cards', giftBrief: 'x'.repeat(2001), giftQuantity: '50001' });
	assert.deepEqual(giftQueryPrefill(params), { requirement: '', quantity: '' });
	params.set('giftQuantity', '1.5');
	assert.equal(giftQueryPrefill(params).quantity, '');
});
