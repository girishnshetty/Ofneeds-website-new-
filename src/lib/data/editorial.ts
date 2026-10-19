export type CaseStudy = {
	slug: string;
	client: string;
	requirement: string;
	products: string[];
	quantity: string;
	branding: string;
	timeline: string;
	deliveryLocation: string;
	images: { src: string; alt: string }[];
	outcome: string;
	published: boolean;
	projectType?: string;
};
export type Brand = {
	slug: string;
	name: string;
	description: string;
	logo?: string;
	products: string[];
	verified: boolean;
};
export type Article = {
	category?: string;
	author?: string;
	updatedAt?: string;
	image?: { src: string; alt: string; width: number; height: number };
	relatedProducts?: string[];
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	sections: { heading: string; paragraphs: string[] }[];
	related: string[];
	published: boolean;
};
// Add owner-approved records only. Empty arrays deliberately publish no fictitious work or brands.
export const caseStudies: CaseStudy[] = [];
export const brands: Brand[] = [];
export const articles: Article[] = [];
