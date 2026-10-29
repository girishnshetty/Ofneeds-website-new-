import { giftCatalogue } from './gift-card-catalogue';
export { giftCategories } from './gift-card-catalogue';
export const giftBriefLimit = 5;
export const giftPreferences = [
	{ id: 'shopping', name: 'Shopping gift cards', category: 'Shopping', description: 'Let recipients choose something for their everyday needs.', colour: '#224b46', mark: 'A little choice.' },
	{ id: 'dining', name: 'Food & dining gift cards', category: 'Food & dining', description: 'A meal, a coffee or a well-earned break.', colour: '#8c4b35', mark: 'Make their day.' },
	{ id: 'fashion', name: 'Fashion gift cards', category: 'Fashion', description: 'A thoughtful gesture with room for personal style.', colour: '#554663', mark: 'Their own style.' },
	{ id: 'travel', name: 'Travel gift cards', category: 'Travel', description: 'Help your team plan their next little escape.', colour: '#315d86', mark: 'Go somewhere.' },
	{ id: 'wellness', name: 'Wellness gift cards', category: 'Wellness', description: 'Recognise your people with a moment for themselves.', colour: '#687047', mark: 'Time for them.' }
] as const;
export type GiftLine = { id: string; quantity: number; value: number; brand: string };
export type GiftBrief = { lines: GiftLine[]; occasion: string };
export const giftOccasions = ['Employee recognition', 'Festive gifting', 'Employee milestones', 'Client appreciation', 'Sales incentives', 'Other programme'] as const;
export const giftStorageKey = 'ofneeds-gift-brief-v1';
export const giftOptionFor = (id: string) => giftCatalogue.find(option => option.id === id) ?? giftPreferences.find(option => option.id === id);
export const giftMoney = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
export function validGiftLine(line: GiftLine): boolean {
	const option = giftOptionFor(line.id);
	return !!option && Number.isInteger(line.quantity) && line.quantity >= 1 && line.quantity <= 10000 && Number.isInteger(line.value) && ('denominations' in option ? option.denominations.includes(line.value) : line.value >= 100 && line.value <= 100000) && typeof line.brand === 'string' && line.brand.length <= 80;
}
export function restoreGiftBrief(raw: string | null): GiftBrief {
	const empty = { lines: [], occasion: 'Employee recognition' };
	try {
		const data = JSON.parse(raw || 'null');
		if (!data || !Array.isArray(data.lines) || data.lines.length > giftBriefLimit || typeof data.occasion !== 'string' || data.occasion.length > 100) return empty;
		const seen = new Set<string>();
		const lines = data.lines.filter((line: GiftLine) => {
			if (!line || !validGiftLine(line) || seen.has(line.id)) return false;
			seen.add(line.id); return true;
		});
		return { lines, occasion: giftOccasions.some(option => option === data.occasion) ? data.occasion : empty.occasion };
	} catch { return empty; }
}
export function giftBriefText(brief: GiftBrief): string {
	if (!brief.lines.length || brief.lines.length > giftBriefLimit || new Set(brief.lines.map(line => line.id)).size !== brief.lines.length || !brief.lines.every(validGiftLine)) return '';
	return ['India gift-card sourcing enquiry', `Occasion: ${brief.occasion.slice(0, 100)}`, ...brief.lines.map(line => {
		const option = giftOptionFor(line.id)!;
		const listing = 'copies' in option && option.copies > 1 ? ` (listing ${option.listing} of ${option.copies})` : '';
		return `${option.name}${listing}${line.brand.trim() ? ` (preferred brand: ${line.brand.trim()})` : ''}: ${line.quantity} vouchers x ${giftMoney(line.value)} requested face value.`;
	}), `Combined requested face value: ${giftMoney(brief.lines.reduce((sum, line) => sum + line.quantity * line.value, 0))}. This is a planning amount, not a quotation.`, 'Please confirm available brands, denominations, validity, redemption restrictions, delivery method, fees and commercial terms.'].join('\n');
}
export function giftContactHref(brief: GiftBrief): string {
	const text = giftBriefText(brief);
	return '/contact?' + new URLSearchParams({ interest: 'gift-cards', ...(text ? { giftBrief: text, giftQuantity: String(brief.lines.reduce((sum, line) => sum + line.quantity, 0)) } : {}) }) + '#quote';
}
export function giftQueryPrefill(params: URLSearchParams): { requirement: string; quantity: string } {
	if (params.get('interest') !== 'gift-cards') return { requirement: '', quantity: '' };
	const requirement = params.get('giftBrief') || '';
	const quantity = Number(params.get('giftQuantity'));
	return { requirement: requirement.length <= 2000 ? requirement : '', quantity: Number.isInteger(quantity) && quantity > 0 && quantity <= 50000 ? String(quantity) : '' };
}
