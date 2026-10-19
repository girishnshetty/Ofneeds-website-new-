// Comparable local production-build resource checks. Not a Lighthouse or Web Vitals measurement.
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
const bases = process.argv.slice(2);
if (bases.length !== 2 || bases.some(base => !['127.0.0.1','localhost'].includes(new URL(base).hostname))) throw new Error('Pass baseline and updated local production preview URLs');
const result = { measuredAt: new Date().toISOString(), scope: 'Local production HTML and directly referenced resources. Counts are not network waterfall measurements, Lighthouse scores or field Web Vitals.', versions: [] };
for (const [index, base] of bases.entries()) {
 const pages = [];
 for (const route of ['/', '/catalogues']) {
  const response = await fetch(base + route); if (!response.ok) throw new Error(base + route + ': ' + response.status);
  const html = await response.text();
  const images = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
  const assets = [...new Set([...html.matchAll(/<link\b[^>]*\bhref="([^"]+\.(?:js|css))"/g)].map(match => match[1]))];
  let resourceBytes = 0, resourceGzipBytes = 0;
  for (const asset of assets) { const fetched = await fetch(new URL(asset, base)); const bytes = Buffer.from(await fetched.arrayBuffer()); resourceBytes += bytes.length; resourceGzipBytes += gzipSync(bytes).length; }
  pages.push({ route, htmlBytes: Buffer.byteLength(html), htmlGzipBytes: gzipSync(html).length, renderedImageTags: images.length, uniqueImageSources: new Set(images).size, lazyImageTags: [...html.matchAll(/loading="lazy"/g)].length, directlyLinkedCssJsAssets: assets.length, directlyLinkedCssJsBytes: resourceBytes, directlyLinkedCssJsGzipBytes: resourceGzipBytes, reviewCards: [...html.matchAll(/<blockquote>/g)].length, catalogueCards: [...html.matchAll(/class="catalogue-card\b/g)].length });
 }
 result.versions.push({ version: index ? 'updated' : 'baseline', base, pages });
}
fs.mkdirSync('output/validation', {recursive:true}); fs.writeFileSync('output/validation/resource-comparison.json', JSON.stringify(result,null,2)); console.log(JSON.stringify(result,null,2));

