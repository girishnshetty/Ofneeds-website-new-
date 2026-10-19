import { error } from '@sveltejs/kit';
import { articles } from '$lib/data/editorial';
import type { PageLoad } from './$types';
export const load: PageLoad = ({ params }) => {
	const article = articles.find((article) => article.slug === params.slug && article.published);
	if (!article) error(404, 'This article is not available.');
	return { article };
};
