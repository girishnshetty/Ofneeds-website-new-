// Optional preparation tool. Supply an installed sharp module path, or install
// sharp separately; the deployed website has no image-processing dependency.
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const sharp = createRequire(import.meta.url)(process.argv[2] ? path.resolve(process.argv[2]) : 'sharp');
const sources = JSON.parse(await readFile('docs/photography-sources.json', 'utf8'));
const output = {};
await mkdir('static/media', { recursive: true });
for (const [key, photo] of Object.entries(sources)) {
 const source = photo.srcset.split(',').at(-1).trim().split(/\s+/)[0];
 if (!source.startsWith('/') || source.includes('..')) throw new Error('Use a local source asset');
 const input = path.join('static', source);
 const meta = await sharp(input).metadata();
 const widths = [...new Set([240, 360, 480, 720, 960, Math.min(meta.width, 1440)].filter(width => width <= meta.width))].sort((a,b) => a-b);
 const variants = [];
 for (const width of widths) {
  const { data, info } = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toBuffer({ resolveWithObject: true });
  const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
  const src = `/media/${key}-${info.width}.${hash}.webp`;
  await writeFile(path.join('static', src), data);
  variants.push({ src, width: info.width, height: info.height, bytes: data.length });
 }
 const standard = variants.find(item => item.width >= 900) || variants.at(-1);
 output[key] = { ...photo, src: standard.src, srcset: variants.map(item => `${item.src} ${item.width}w`).join(', '), width: standard.width, height: standard.height };
 console.log(`${key}: ${variants.length} responsive sizes, ${standard.width} × ${standard.height}`);
}
await writeFile('src/lib/data/optimized-media.json', JSON.stringify(output, null, 2) + '\n');
