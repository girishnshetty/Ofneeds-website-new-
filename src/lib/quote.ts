import { writable, derived } from 'svelte/store';
import { productFor } from './data/products';
import { track } from './analytics';
import { normalizeItems, type QuoteItem } from './quote-items';
export { normalizeItems, quoteSummary } from './quote-items';
const storageKey = 'ofneeds-quote-v1';
const state = writable<QuoteItem[]>([]);
let loaded = false;
let storageAvailable = true;
export const quoteStorageAvailable = writable(true);
function persist(items: QuoteItem[]) {
	if (typeof window === 'undefined') return;
	try { sessionStorage.setItem(storageKey, JSON.stringify(items)); }
	catch { storageAvailable = false; quoteStorageAvailable.set(false); }
}
export const quote = {
	subscribe: state.subscribe,
	load() {
		if (loaded || typeof window === 'undefined') return;
		loaded = true;
		try { state.set(normalizeItems(JSON.parse(sessionStorage.getItem(storageKey) || '[]'))); }
		catch { storageAvailable = false; quoteStorageAvailable.set(false); }
	},
	add(id: string, quantity = 1) {
		if (!productFor(id) || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 1000000) return;
		this.load();
		state.update((items) => { const next = normalizeItems(items.some((item) => item.id === id) ? items.map((item) => item.id === id ? { id, quantity } : item) : [...items, { id, quantity }]); persist(next); return next; });
		track('Product Added to Quote', { product_id: id });
	},
	setQuantity(id: string, quantity: number) {
		if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 1000000) return;
		state.update((items) => { const next = items.map((item) => item.id === id ? { id, quantity } : item); persist(next); return next; });
	},
	remove(id: string) { state.update((items) => { const next = items.filter((item) => item.id !== id); persist(next); return next; }); },
	clear() { state.set([]); persist([]); },
	get storageAvailable() { return storageAvailable; }
};
export const quoteCount = derived(state, (items) => items.length);
