import fs from 'node:fs';
import crypto from 'node:crypto';
const files = JSON.parse(fs.readFileSync('src/lib/data/catalogues.json', 'utf8').replace(/^\uFEFF/, ''));
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync('static' + file.image)).digest('hex');
const sizeMB = (size) => /KB/i.test(size || '') ? parseFloat(size) / 1024 : /MB/i.test(size || '') ? parseFloat(size) : /GB/i.test(size || '') ? parseFloat(size) * 1024 : 0;
const groups = new Map();
for (const file of files.filter((file) => file.hasCover)) { const key = hash(file) + ':' + file.size; groups.set(key, [...(groups.get(key) || []), file]); }
const report = {
 auditedAt: '2026-10-19', remoteMetadataLastCheckedAt: '2026-10-05',
 limitation: 'Current Google Drive permissions and complete PDF contents were not verified. Matching covers and displayed sizes establish possible duplicates only. Original source records are retained.',
 counts: { sourceFiles: files.length, historicallyDownloadable: files.filter((file) => file.available).length, historicalZeroByte: files.filter((file) => !file.available).length, localCovers: files.filter((file) => file.hasCover).length },
 unavailable: files.filter((file) => !file.available).map(({ id, name }) => ({ id, name, reason: 'Zero-byte file in 5 October source audit', action: 'Hide download; request a replacement copy' })),
 possibleDuplicates: [...groups.values()].filter((group) => group.length > 1).map((group) => ({ ids: group.map((file) => file.id), names: group.map((file) => file.name), evidence: 'Byte-identical local cover and equal displayed download size', action: 'Group sources without choosing a latest edition; owner must compare complete files' })),
 oversized: files.filter((file) => sizeMB(file.size) >= 50).map(({ id, name, size }) => ({ id, name, size, action: 'Warn before download; request current compact edition' })),
 missingCovers: files.filter((file) => file.available && !file.hasCover).map(({ id, name }) => ({ id, name, action: 'Use neutral document fallback' }))
};
fs.writeFileSync('src/lib/data/catalogue-review.json', JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync('docs/CATALOGUE-REVIEW.md', '# Catalogue source review\n\nLocal audit: 19 October 2026. Last recorded remote metadata check: 5 October 2026. Current Drive access and complete file contents have not been verified. Do not delete supplier originals or select a latest edition from filenames alone.\n\n' + 'Counts: ' + JSON.stringify(report.counts) + '\n\n## Request replacement copies\n\n' + report.unavailable.map((file) => '- ' + file.name + ' — ' + file.id).join('\n') + '\n\n## Possible duplicate editions\n\n' + report.possibleDuplicates.map((group) => '- ' + group.names.join(' / ') + ': matching cover bytes and displayed size, full contents unverified.').join('\n') + '\n\n## Large files\n\n' + report.oversized.map((file) => '- ' + file.name + ' — ' + file.size).join('\n') + '\n\nSix available files have no local cover. The application uses neutral document covers. The complete machine-readable review is retained in src/lib/data/catalogue-review.json. A Google Drive metadata/permission review needs owner access.\n');
console.log(JSON.stringify(report.counts));
console.log('Possible duplicate groups: ' + report.possibleDuplicates.length);

