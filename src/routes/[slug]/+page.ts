import { seoRedirects } from '$lib/data/seo-redirects';
import { error, redirect } from '@sveltejs/kit';
import { pageFor } from '$lib/data/catalog';
import { contentPages, type ContentSlug } from '$lib/data/pages';
import type { PageLoad } from './$types';
export const load: PageLoad = ({ params }) => {
	if (Object.hasOwn(seoRedirects, params.slug)) redirect(308, seoRedirects[params.slug]);
	const landing = pageFor(params.slug);
	const content = Object.hasOwn(contentPages, params.slug)
		? contentPages[params.slug as ContentSlug]
		: null;
	if (!landing && !content) error(404, 'This page could not be found.');
	return { landing, content, slug: params.slug };
};
