// Read-only HTTP checks against a local preview; never submits to Tally or WhatsApp.
import assert from 'node:assert/strict';
const base = process.argv[2] || 'http://127.0.0.1:5174';
assert.ok(
	['127.0.0.1', 'localhost', '[::1]'].includes(new URL(base).hostname),
	'Use a local preview'
);
const sitemapResponse = await fetch(base + '/sitemap.xml');
assert.equal(sitemapResponse.status, 200);
const xml = await sitemapResponse.text();
const routes = [...xml.matchAll(/<loc>https:\/\/www\.ofneeds\.com([^<]*)<\/loc>/g)].map(
	(match) => match[1]
);
assert.ok(routes.length >= 24);
assert.equal(new Set(routes).size, routes.length);
const titles = new Set();
const descriptions = new Set();
const documents = new Map();
const internal = new Set();
const images = new Set();
let schemaCount = 0;
for (const route of routes) {
	const response = await fetch(base + route);
	assert.equal(response.status, 200, route);
	const html = await response.text();
	documents.set(route, html);
	assert.equal([...html.matchAll(/<h1\b/g)].length, 1, route + ' has one H1');
	const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
	assert.ok(title, route + ' title');
	assert.ok(!titles.has(title), 'Unique title: ' + route);
	titles.add(title);
	const description = html.match(/<meta name="description" content="([^"]+)"/s)?.[1];
	assert.ok(description, route + ' description');
	assert.ok(!descriptions.has(description), 'Unique description: ' + route);
	descriptions.add(description);
	assert.ok(
		html.includes('rel="canonical" href="https://www.ofneeds.com' + route + '"'),
		route + ' canonical'
	);
	assert.ok(
		html.includes('property="og:image"') && html.includes('name="twitter:card"'),
		route + ' social metadata'
	);
	for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
		const schema = JSON.parse(match[1]);
		assert.equal(schema['@context'], 'https://schema.org');
		assert.ok(schema['@graph'].some((item) => item['@type'] === 'Organization'));
		assert.ok(schema['@graph'].some((item) => item['@type'] === 'BreadcrumbList'));
		schemaCount++;
	}
	for (const match of html.matchAll(/<a\b[^>]*\bhref="(\/[^"]*|#[^"]+)"/g)) {
		const url = new URL(match[1].replace(/&amp;/g, '&'), base + route);
		internal.add(url.pathname);
		if (url.hash) {
			const target =
				documents.get(url.pathname) || (await (await fetch(base + url.pathname)).text());
			assert.ok(target.includes('id="' + url.hash.slice(1) + '"'), route + ' anchor ' + url.hash);
		}
	}
	for (const match of html.matchAll(/<img\b[^>]*\bsrc="(\/[^"]+)"/g)) images.add(match[1]);
	assert.ok(!html.includes('OffiNeeds'), route + ' exact brand');
}
for (const route of internal)
	assert.equal((await fetch(base + route)).status, 200, 'Internal link: ' + route);
for (const image of images) {
	const response = await fetch(base + image);
	assert.equal(response.status, 200, 'Image: ' + image);
	assert.ok(response.headers.get('content-type')?.startsWith('image/'));
}
const robots = await (await fetch(base + '/robots.txt')).text();
assert.ok(robots.includes('Sitemap: https://www.ofneeds.com/sitemap.xml'));
assert.ok(!robots.includes('Disallow: /'));
const home = documents.get('/');
assert.ok(home.includes('tally.so/r/OD0ZV7'));
assert.ok(home.includes('wa.me/917090795666'));
assert.ok(home.includes('₹499') && home.includes('₹999'));
for (const name of [
	'Gladwin Bosco',
	'Krishna Murthy',
	'Bhuweneshwari',
	'Prashanth',
	'Pallavi',
	'Anand Sunkad',
	'Palanisamy Kumarasamy'
])
	assert.ok(home.includes(name), 'Preserved testimonial: ' + name);
for (const route of [
	'/not-a-real-page',
	'/brands/unverified-brand',
	'/insights/unpublished-article'
]) {
	const response = await fetch(base + route);
	assert.equal(response.status, 404, route);
	assert.ok((await response.text()).includes('noindex, follow'));
}
const reviews = [...home.matchAll(/<blockquote>(.*?)<\/blockquote>/gs)].map((match) => match[1]);
assert.equal(reviews.length, 7, 'Seven distinct reviews');
assert.equal(new Set(reviews).size, reviews.length, 'No repeated testimonial text');
const queryHome = await (await fetch(base + '/?utm_source=test')).text();
assert.ok(queryHome.includes('rel="canonical" href="https://www.ofneeds.com/"'));
const trailing = await fetch(base + '/corporate-drinkware/', { redirect: 'manual' });
assert.equal(trailing.status, 308);
assert.equal(trailing.headers.get('location'), '/corporate-drinkware');
console.log(
	JSON.stringify(
		{
			routes: routes.length,
			internalLinks: internal.size,
			images: images.size,
			jsonLdPages: schemaCount,
			uniqueTitles: titles.size,
			uniqueDescriptions: descriptions.size,
			result: 'passed'
		},
		null,
		2
	)
);
