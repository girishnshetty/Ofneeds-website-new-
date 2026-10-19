// Local read-only SEO and offline campaign checks. Never contacts an advertising account.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:5174';
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(base).hostname));
const profiles = JSON.parse(await readFile(new URL('../src/lib/data/seo-pages.json', import.meta.url), 'utf8'));
const origin = 'https://www.ofneeds.com';
const decode = (value) => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], decode(m[2])]));
function csv(text) {
    const rows = []; let row = [], field = '', quoted = false;
    text = text.replace(/^\uFEFF/, '');
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') { if (quoted && text[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted; }
        else if (c === ',' && !quoted) { row.push(field); field = ''; }
        else if (c === '\n' && !quoted) { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
        else field += c;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    const header = rows.shift();
    return rows.filter((r) => r.some(Boolean)).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}
function dimensions(bytes) {
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    const type = bytes.toString('ascii', 12, 16);
    if (type === 'VP8X') return [bytes.readUIntLE(24, 3) + 1, bytes.readUIntLE(27, 3) + 1];
    if (type === 'VP8 ') return [bytes.readUInt16LE(26) & 0x3fff, bytes.readUInt16LE(28) & 0x3fff];
    if (type === 'VP8L') { const bits = bytes.readUInt32LE(21); return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1]; }
    throw new Error('Unrecognized WebP image format: ' + type);
}
const titles = new Set(), descriptions = new Set(), socialImages = new Map();
let services = 0, faqQuestions = 0;
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
for (const [path, profile] of Object.entries(profiles)) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const metas = new Map([...html.matchAll(/<meta\b[^>]*>/g)].map((m) => { const a = attrs(m[0]); return [a.name ?? a.property, a.content]; }));
    const title = decode(html.match(/<title>(.*?)<\/title>/s)[1]);
    assert.equal(title, profile.title, path + ' title');
    assert.equal(metas.get('description'), profile.description, path + ' description');
    assert.equal(metas.get('keywords'), profile.keywords.join(', '), path + ' keyword map');
    assert.ok(!titles.has(title) && !descriptions.has(profile.description), path + ' unique metadata');
    titles.add(title); descriptions.add(profile.description);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, path + ' one H1');
    assert.ok(html.includes(`rel="canonical" href="${origin + path}"`));
    assert.equal(metas.get('robots'), 'index, follow, max-image-preview:large');
    assert.equal(metas.get('og:title'), title);
    assert.equal(metas.get('og:description'), profile.description);
    assert.equal(metas.get('og:url'), origin + path);
    assert.equal(metas.get('og:locale'), 'en_IN');
    assert.equal(metas.get('twitter:image'), metas.get('og:image'));
    assert.ok(metas.get('og:image:alt') && metas.get('twitter:image:alt'));
    const imagePath = new URL(metas.get('og:image')).pathname;
    assert.equal(new URL(metas.get('og:image')).origin, origin);
    if (!socialImages.has(imagePath)) {
        const asset = await fetch(base + imagePath);
        assert.equal(asset.status, 200, imagePath);
        socialImages.set(imagePath, dimensions(Buffer.from(await asset.arrayBuffer())));
    }
    assert.deepEqual(socialImages.get(imagePath), [Number(metas.get('og:image:width')), Number(metas.get('og:image:height'))], path + ' actual image dimensions');
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap((m) => JSON.parse(m[1])['@graph']);
    const org = schemas.find((s) => s['@type'] === 'Organization');
    assert.equal(org.name, 'OfNeeds');
    assert.equal(org.logo.url, origin + '/ofneeds-navbar-logo.png');
    assert.equal(org.address.addressLocality, 'Bengaluru');
    assert.deepEqual(org.contactPoint.map((p) => p.telephone), ['+917090795666', '+919739195666']);
    const webpage = schemas.find((s) => s['@id'] === origin + path + '#webpage');
    assert.equal(webpage['@type'], profile.pageType);
    const text = decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ');
    if (profile.service) {
        const service = schemas.find((s) => s['@type'] === 'Service');
        assert.equal(service.name, profile.service);
        assert.equal(service.url, origin + path);
        assert.equal(service.provider['@id'], origin + '/#organization'); services++;
        const faq = schemas.find((s) => s['@type'] === 'FAQPage');
        assert.equal(faq.mainEntity.length, profile.faqs.length);
        for (let i = 0; i < profile.faqs.length; i++) {
            assert.equal(faq.mainEntity[i].name, profile.faqs[i].question);
            assert.equal(faq.mainEntity[i].acceptedAnswer.text, profile.faqs[i].answer);
            assert.ok(text.includes(profile.faqs[i].question) && text.includes(profile.faqs[i].answer), path + ' visible FAQ/schema parity'); faqQuestions++;
        }
    }
    assert.ok(sitemap.includes(`<loc>${origin + path}</loc><lastmod>${profile.updated}</lastmod>`), path + ' sitemap revision');
    assert.ok(!/offineeds/i.test(html), path + ' OfNeeds branding only');
    assert.ok(!/googletagmanager\.com|google-analytics\.com|gtag\(|fbq\(|connect\.facebook\.net/.test(html), path + ' no measurement scripts');
}
for (const path of ['/not-a-real-page', '/brands/unverified-brand', '/insights/unpublished-article']) {
    const response = await fetch(base + path); assert.equal(response.status, 404);
    assert.ok((await response.text()).includes('noindex, follow'));
}
const loadCsv = async (name) => csv(await readFile(new URL('../marketing/' + name, import.meta.url), 'utf8'));
const keywords = await loadCsv('sem-keywords.csv'), ads = await loadCsv('sem-responsive-search-ads.csv'), plan = await loadCsv('sem-campaign-plan.csv');
for (const keyword of keywords) {
    assert.equal(keyword.Status, 'Paused'); assert.ok(['Exact', 'Phrase'].includes(keyword['Match type']));
    assert.ok(profiles[new URL(keyword['Final URL']).pathname]); assert.ok(!/offineeds/i.test(keyword.Keyword));
}
for (const ad of ads) {
    assert.equal(ad.Status, 'Paused'); assert.equal(ad['Ad type'], 'Responsive search ad');
    assert.equal(new URL(ad['Final URL']).origin, origin); assert.ok(profiles[new URL(ad['Final URL']).pathname]);
    for (let i = 1; i <= 8; i++) assert.ok(ad['Headline ' + i].length > 0 && ad['Headline ' + i].length <= 30, ad['Ad group'] + ' headline ' + i + ': ' + ad['Headline ' + i]);
    for (let i = 1; i <= 4; i++) assert.ok(ad['Description ' + i].length > 0 && ad['Description ' + i].length <= 90, ad['Ad group'] + ' description ' + i);
    for (let i = 1; i <= 2; i++) assert.ok(ad['Path ' + i].length <= 15);
}
for (const campaign of plan) { assert.equal(campaign.Status, 'Paused'); assert.equal(campaign.Tracking, 'Disabled'); assert.equal(campaign['Budget INR per day'], ''); }
const assets = await loadCsv('sem-assets.csv');
for (const asset of assets) {
    assert.ok(asset.Text.length <= 25, 'asset text limit');
    if (asset['Asset type'] === 'Sitelink') {
        assert.ok(asset['Description 1'].length <= 35 && asset['Description 2'].length <= 35);
        assert.ok(profiles[new URL(asset['Final URL']).pathname]);
    }
}
assert.equal((await loadCsv('seo-keyword-map.csv')).length, Object.keys(profiles).length);
console.log(JSON.stringify({ pages: titles.size, servicePages: services, visibleFaqs: faqQuestions, socialImages: socialImages.size, semKeywords: keywords.length, pausedAds: ads.length, tracking: 'disabled', result: 'passed' }, null, 2));
