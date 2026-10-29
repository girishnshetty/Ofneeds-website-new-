import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './helpers/load-typescript.mjs';
const { giftBrands, giftBrandFor, giftBrandHref, giftBrandSeo, relatedGiftBrands } = await loadTypescript('src/lib/gift-card-brands.ts');
const { giftCatalogue } = await loadTypescript('src/lib/gift-card-catalogue.ts');
const { giftContactHref, giftQueryPrefill } = await loadTypescript('src/lib/gift-cards.ts');

test('every gift-card listing has one canonical brand page, with equivalent names consolidated', () => {
	assert.equal(giftBrands.length, 312);
	assert.equal(new Set(giftBrands.map(brand => brand.href)).size, 312);
	assert.deepEqual(new Set(giftBrands.flatMap(brand => brand.options.map(option => option.id))), new Set(giftCatalogue.map(option => option.id)));
	assert.equal(giftBrandHref('GIVA Gold Jewellery'), giftBrandHref('Giva-Gold Jewellery'));
	assert.equal(giftBrandFor('not-a-brand'), undefined);
});

test('each brand has distinct metadata, actual denominations and useful related links', () => {
	const titles = new Set();
	const descriptions = new Set();
	for (const brand of giftBrands) {
		const seo = giftBrandSeo(brand);
		assert.match(seo.title, /Gift Cards.*OfNeeds/);
		assert.ok(seo.title.includes(brand.label));
		assert.ok(!titles.has(seo.title), seo.title);
		assert.ok(!descriptions.has(seo.description), seo.description);
		titles.add(seo.title); descriptions.add(seo.description);
		assert.deepEqual(brand.values, [...new Set(brand.options.flatMap(option => option.denominations))].sort((a,b) => a-b));
		assert.ok(seo.faqs[0].answer.includes(brand.name));
		assert.ok(relatedGiftBrands(brand).every(other => other.slug !== brand.slug && other.category === brand.category));
	}
});

test('brand-page requirements transfer real listing IDs, quantities and INR totals into contact', () => {
	const brand = giftBrandFor('starbucks');
	const option = brand.options[0];
	const url = new URL(giftContactHref({ occasion:'Employee recognition', lines:[{ id:option.id, value:option.denominations[0], quantity:25, brand:'' }] }), 'https://www.ofneeds.com');
	const prefill = giftQueryPrefill(url.searchParams);
	assert.equal(prefill.quantity,'25');
	assert.match(prefill.requirement,/Starbucks/);
	assert.match(prefill.requirement,/25 vouchers/);
});
