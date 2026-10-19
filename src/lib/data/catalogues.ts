import files from './catalogues.json';
import review from './catalogue-review.json';
export const catalogueLastChecked = review.remoteMetadataLastCheckedAt;
export const catalogueSizeMB = (size: string | null) => { const amount = parseFloat(size || '0') || 0; return /KB/i.test(size || '') ? amount / 1024 : /GB/i.test(size || '') ? amount * 1024 : /MB/i.test(size || '') ? amount : amount / (1024 * 1024); };
export const displayCatalogueName = (name: string) => name.replace(/(\.(pdf|pptx))+$/i, '').replace(/_/g, ' ').replace(/\b(catlogs|catalouge|catlog)\b/gi, 'Catalogue').replace(/^current stocsk may 2026$/i, 'May 2026 Stock Catalogue').replace(/\s+/g, ' ').trim();
export const catalogues = files.map((file) => ({ ...file, sourceName: file.name, displayName: displayCatalogueName(file.name), edition: file.name.match(/20\d{2}/)?.[0] ?? null, sizeMB: catalogueSizeMB(file.size), status: file.available ? 'downloadable' as const : 'request-copy' as const, lastCheckedAt: catalogueLastChecked }));
export const catalogueFolderUrl = 'https://drive.google.com/drive/folders/1mO-eeV-4dVE-8AUtDQOuJI80twGfsw7r';
export const catalogueCategories = ['All', 'Apparel', 'Drinkware', 'Bags', 'Tech & Gadgets', 'Notebooks', 'Pens', 'Accessories', 'Home & Appliances', 'Footwear', 'Food & Hampers', 'Gift Sets', 'Eco Gift Sets', 'General Gifting'];
const seen = new Set<string>();
export const catalogueCollections = catalogues.flatMap((file) => {
 if (seen.has(file.id)) return [];
 const group = review.possibleDuplicates.find((group) => group.ids.includes(file.id));
 const sources = group ? catalogues.filter((item) => group.ids.includes(item.id)) : [file];
 sources.forEach((source) => seen.add(source.id));
 return [{ ...file, sources, displayName: group ? file.displayName.replace(/\s*\(1\)/, '').replace(/Catalog1/i, 'Catalog') : file.displayName, possibleDuplicate: !!group }];
});
const groupsBySlug: Record<string, string[]> = {
 'corporate-apparel': ['Apparel'], 'corporate-tshirts-bangalore': ['Apparel'],
 'corporate-drinkware': ['Drinkware'], 'corporate-water-bottles': ['Drinkware'], 'corporate-mugs': ['Drinkware'], 'corporate-tumblers': ['Drinkware'],
 'corporate-backpacks': ['Bags'], 'corporate-notebooks-diaries': ['Notebooks', 'Pens'], 'corporate-pens': ['Pens'],
 'eco-friendly-corporate-gifts': ['Eco Gift Sets'], 'tech-corporate-gifts': ['Tech & Gadgets', 'Accessories'],
 'client-gifts': ['Gift Sets', 'Food & Hampers', 'Tech & Gadgets'], 'premium-gifts': ['Gift Sets', 'Food & Hampers', 'Tech & Gadgets']
};
export const catalogueGroupsFor = (slug: string): string[] => {
 if (groupsBySlug[slug]) return groupsBySlug[slug];
 if (['festive-corporate-gifts','diwali-gifts','christmas-gifts','new-year-gifts'].includes(slug)) return ['Gift Sets', 'Food & Hampers', 'Eco Gift Sets'];
 if (['employee-welcome-kits-bangalore','custom-gift-sets','employee-gifts'].includes(slug)) return ['Gift Sets','Eco Gift Sets'];
 if (['corporate-gifting-bangalore','event-merchandise','corporate-gifts','branded-merchandise','hr-procurement-gifting','corporate-gifts-under-500','corporate-gifts-under-1000','corporate-gifts-under-2000'].includes(slug)) return ['Drinkware','Bags','Notebooks','Tech & Gadgets'];
 return [];
};
export const catalogueForCategory = (category: string) => catalogues.find(file => file.category === category && file.available && file.hasCover && file.name.startsWith('UG ')) ?? catalogues.find(file => file.category === category && file.available && file.hasCover) ?? catalogues.find(file => file.category === category && file.available);
