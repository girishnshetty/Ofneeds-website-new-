import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const media = JSON.parse(await readFile('src/lib/data/optimized-media.json', 'utf8'));
test('responsive media descriptors and immutable URLs match committed asset bytes', async () => {
 assert.ok(Object.keys(media).length > 0);
 for (const photo of Object.values(media)) {
  assert.ok(photo.alt && photo.width > 0 && photo.height > 0);
  const widths = new Set();
  const variants = photo.srcset.split(',').map(item => item.trim().split(/\s+/));
  assert.ok(variants.length >= 3);
  assert.ok(variants.some(([src]) => src === photo.src));
  for (const [src, descriptor] of variants) {
   const match = src.match(/^\/media\/[a-zA-Z]+-(\d+)\.([a-f0-9]{12})\.webp$/);
   assert.ok(match, 'Only hashed local media gets immutable caching: ' + src);
   assert.equal(descriptor, match[1] + 'w');
   assert.ok(!widths.has(descriptor)); widths.add(descriptor);
   const bytes = await readFile('static' + src);
   assert.equal(createHash('sha256').update(bytes).digest('hex').slice(0, 12), match[2]);
   assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
   if (src === photo.src) assert.equal(photo.width, Number(match[1]));
  }
 }
});
