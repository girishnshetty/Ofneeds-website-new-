import { photography, type Photography, type PhotoKey } from './photography';
export type Category = {
	title: string;
	description: string;
	image: string;
	href: string;
	imageAlt: string;
	photo: Photography;
};
const categoryDetails: [string, string, string, PhotoKey][] = [
	[
		'Employee Welcome Kits',
		'A thoughtful first day, in one considered kit.',
		'employee-welcome-kits-bangalore',
		'welcome'
	],
	['Corporate Apparel', 'Wear your brand, at work and beyond.', 'corporate-apparel', 'apparel'],
	[
		'Drinkware',
		'Everyday essentials that keep your brand close.',
		'corporate-drinkware',
		'drinkware'
	],
	[
		'Notebooks & Stationery',
		'Good ideas deserve a great place to start.',
		'corporate-notebooks-diaries',
		'notebooks'
	],
	[
		'Awards & Trophies',
		'Recognize the people behind every milestone.',
		'corporate-trophies-awards',
		'awards'
	],
	[
		'Backpacks & Travel',
		'Built for the commute and everything after.',
		'corporate-backpacks',
		'backpacks'
	],
	['Tech Accessories', 'Useful additions to the modern workspace.', 'tech-corporate-gifts', 'tech'],
	[
		'Executive Gifts',
		'Considered gifts for lasting business connections.',
		'client-gifts',
		'executive'
	],
	[
		'Event Merchandise',
		'Make your next gathering feel like your brand.',
		'event-merchandise',
		'events'
	],
	[
		'Festive Gifts',
		'Celebrate the season with a personal touch.',
		'festive-corporate-gifts',
		'festive'
	],
	[
		'Eco-Friendly Gifts',
		'Reusable essentials for everyday routines.',
		'eco-friendly-corporate-gifts',
		'eco'
	],
	[
		'Custom Gift Sets',
		'Your occasion. Your budget. Your product mix.',
		'custom-gift-sets',
		'custom'
	]
];
export const categories: Category[] = categoryDetails.map(([title, description, slug, key]) => {
	const photo = photography[key];
	return { title, description, image: photo.src, href: '/' + slug, imageAlt: photo.alt, photo };
});
