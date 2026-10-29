import { giftCatalogue, type GiftOption } from './gift-card-catalogue';

export const giftBrandSlug = (name: string) => name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const giftBrandHref = (name: string) => '/gift-cards/' + giftBrandSlug(name);
export type GiftBrand = { slug: string; href: string; name: string; label: string; category: string; options: GiftOption[]; values: number[]; logo: GiftOption['logo'] };
const groups = new Map<string, GiftOption[]>();
for (const option of giftCatalogue) {
	const slug = giftBrandSlug(option.name);
	groups.set(slug, [...(groups.get(slug) ?? []), option]);
}
export const giftBrands: GiftBrand[] = [...groups.entries()].map(([slug, options]) => {
	const first = options[0];
	const label = first.name.replace(/\s+(?:e[- ]?)?gift\s*cards?$/i, '').replace(/\s+vouchers?$/i, '').trim();
	return { slug, href: '/gift-cards/' + slug, name: first.name, label, category: first.category, options, values: [...new Set(options.flatMap(option => option.denominations))].sort((a, b) => a - b), logo: first.logo };
}).sort((a, b) => a.name.localeCompare(b.name, 'en-IN'));
export const giftBrandFor = (slug: string) => giftBrands.find(brand => brand.slug === slug);
export const relatedGiftBrands = (brand: GiftBrand) => {
	const peers = giftBrands.filter(other => other.category === brand.category && other.slug !== brand.slug);
	const offset = Math.max(0, peers.findIndex(other => other.name.localeCompare(brand.name, 'en-IN') > 0));
	return [...peers.slice(offset), ...peers.slice(0, offset)].slice(0, 6);
};
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
export function giftBrandSeo(brand: GiftBrand) {
	return {
		title: `${brand.label} Gift Cards & Vouchers | OfNeeds`,
		description: `Enquire about ${brand.label} gift cards with OfNeeds in India. Compare listed INR values and plan a bulk employee or client gifting quotation.`,
		keywords: [`${brand.label} gift cards OfNeeds`, `${brand.label} giftcard`, `${brand.label} gift vouchers India`, `${brand.label} corporate gifting`, `${brand.label} employee rewards`],
		updated: '2026-10-29', pageType: 'ItemPage', service: `${brand.label} Corporate Gift Card Sourcing`,
		faqs: [
			{ question: `Which ${brand.label} gift-card values can I enquire about?`, answer: `The catalogue lists ${brand.values.map(money).join(', ')} for ${brand.name}. Select a listing and face value in the form. OfNeeds confirms supported denominations, availability and commercial pricing before an order.` },
			{ question: `How do I request ${brand.label} gift cards in bulk?`, answer: `Choose a listed value and the number of vouchers for your ${brand.label} requirement, then continue to the OfNeeds enquiry form. Add your company, occasion and required date so our team can prepare a quotation.` },
			{ question: `What validity and redemption terms apply to ${brand.label} vouchers?`, answer: `Validity, redemption restrictions, delivery method, fees and taxes for the selected ${brand.label} option must be confirmed in the quotation. A catalogue listing does not confirm stock or an authorised reseller relationship.` },
			{ question: `Can I combine ${brand.label} gift cards with other corporate gifts?`, answer: `Yes. Browse the OfNeeds gift-card catalogue to plan several gift-card options, or keep a separate physical-product shortlist. Your ${brand.label} requirement can accompany the same enquiry with packaging or branding notes.` }
		]
	};
}
export function giftBrandSeoForPath(path: string) {
	const match = /^\/gift-cards\/([^/]+)$/.exec(path);
	const brand = match ? giftBrandFor(match[1]) : undefined;
	return brand ? giftBrandSeo(brand) : undefined;
}
