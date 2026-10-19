export type AnalyticsEvent = 'Product Viewed' | 'Category Viewed' | 'Catalogue Downloaded' | 'Quote Started' | 'Product Added to Quote' | 'Quote Submitted' | 'WhatsApp Clicked' | 'Phone Clicked' | 'Email Clicked';
// No tracker or network transmission is installed. A consent-aware existing provider can subscribe.
export function track(name: AnalyticsEvent, data: { product_id?: string; category_id?: string; catalogue_id?: string; item_count?: number } = {}) {
	if (typeof window === 'undefined') return;
	const allowed = Object.fromEntries(Object.entries(data).filter(([key, value]) =>
		['product_id', 'category_id', 'catalogue_id', 'item_count'].includes(key) &&
		(typeof value === 'number' || (typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value)))));
	window.dispatchEvent(new CustomEvent('ofneeds:analytics', { detail: { event: name, ...allowed } }));
}
