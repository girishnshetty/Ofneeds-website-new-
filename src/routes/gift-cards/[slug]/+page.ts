import { error } from '@sveltejs/kit';
import { giftBrandFor, giftBrandSeo, relatedGiftBrands } from '$lib/gift-card-brands';
import type { PageLoad } from './$types';
export const load: PageLoad = ({ params }) => {
	const brand = giftBrandFor(params.slug);
	if (!brand) error(404, 'This gift-card brand could not be found.');
	return { brand, seo: giftBrandSeo(brand), related: relatedGiftBrands(brand) };
};
