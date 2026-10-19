import { error } from '@sveltejs/kit';
import { brands } from '$lib/data/editorial';
import type { PageLoad } from './$types';
export const load: PageLoad = ({ params }) => {
	const brand = brands.find((brand) => brand.slug === params.slug && brand.verified);
	if (!brand) error(404, 'This brand page is not available.');
	return { brand };
};
