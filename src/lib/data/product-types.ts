import { products as originalProducts } from './legacy';
import { photography, type Photography, type PhotoKey } from './photography';
export type Product = {
	id: string;
	slug: string;
	category: string;
	categoryHref: string;
	kind: 'selection' | 'package';
	price: number | null;
	priceVerified: boolean;
	inclusions?: string[];
	sku?: string;
	moq?: number;
	material?: string;
	colours?: string[];
	dimensions?: string;
	brandingMethods?: string[];
	gallery?: Photography[];
	name: string;
	image: string;
	description: string;
	href: string;
	photo: Photography;
};
const productRoutes = [
	'corporate-tshirts-bangalore',
	'corporate-notebooks-diaries',
	'event-merchandise',
	'corporate-trophies-awards',
	'corporate-drinkware',
	'corporate-jackets-bangalore',
	'eco-friendly-corporate-gifts',
	'corporate-backpacks'
];
const productPhotoKeys: PhotoKey[] = [
	'apparel',
	'notebooks',
	'caps',
	'awards',
	'drinkware',
	'jackets',
	'eco',
	'backpacks'
];
export const products: Product[] = originalProducts.map((product, i) => {
	const photo = photography[productPhotoKeys[i]];
	const slug = ['t-shirts', 'notebooks', 'caps', 'trophies', 'steel-sipper-bottle', 'jackets', 'reusable-tote-bag', 'backpacks'][i];
	return { ...product, id: slug, slug, category: ['Corporate Apparel', 'Notebooks & Stationery', 'Event Merchandise', 'Awards & Trophies', 'Drinkware', 'Corporate Apparel', 'Eco-Friendly Gifts', 'Backpacks & Travel'][i], categoryHref: '/' + productRoutes[i], kind: 'selection', price: null, priceVerified: false, image: photo.src, photo, href: '/products/' + slug };
});
