import { productFor } from './data/products';
export type QuoteItem = { id: string; quantity: number };
export function normalizeItems(value: unknown): QuoteItem[] {
	if (!Array.isArray(value)) return [];
	const result = new Map<string, QuoteItem>();
	for (const item of value.slice(0, 30)) {
		if (item && typeof item.id === 'string' && productFor(item.id) && Number.isSafeInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 1000000)
			result.set(item.id, { id: item.id, quantity: item.quantity });
	}
	return [...result.values()];
}
export function quoteSummary(items: QuoteItem[]) {
	return normalizeItems(items).map((item) => `${productFor(item.id)!.name} — ${item.quantity} units`).join('\n');
}
