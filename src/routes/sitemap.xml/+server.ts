import { landingPages } from '$lib/data/catalog';
import { contentPages } from '$lib/data/pages';
import { brands, articles } from '$lib/data/editorial';
import { canonical } from '$lib/seo';
import { seoFor } from '$lib/data/seo-pages';
import type { RequestHandler } from './$types';
const escapeXml = (value: string) =>
	value.replace(
		/[<>&'\"]/g,
		(character) =>
			({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] ??
			character
	);
export const GET: RequestHandler = () => {
	const paths = [
		'/',
		'/contact',
		'/catalogues',
		...landingPages.map((page) => '/' + page.slug),
		...Object.keys(contentPages).map((slug) => '/' + slug),
		...brands.filter((brand) => brand.verified).map((brand) => '/brands/' + brand.slug),
		...articles.filter((article) => article.published).map((article) => '/insights/' + article.slug)
	];
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escapeXml(canonical(path))}</loc>${seoFor(path)?.updated ? `<lastmod>${escapeXml(seoFor(path).updated)}</lastmod>` : ''}</url>`).join('')}</urlset>`,
		{
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
				'Cache-Control': 'public, max-age=3600'
			}
		}
	);
};
