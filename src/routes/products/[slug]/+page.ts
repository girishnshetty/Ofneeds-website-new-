import { error } from '@sveltejs/kit';
import { productFor, productSelections } from '$lib/data/products';
import type { PageLoad } from './$types';
export const load: PageLoad = ({ params }) => {
	const product = productFor(params.slug);
	if (!product) error(404, 'This product selection was not found.');
	return { product, related: productSelections.filter((item) => item.id !== product.id && (item.category === product.category || item.kind === product.kind)).slice(0, 3) };
};
