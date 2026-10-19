import { testimonials } from './legacy';
type Story = {
 slug: string;
 client: string;
 title: string;
 summary: string;
 products: string[];
 quantity?: string;
 sourceName: string;
 categoryHref: string;
};
// Summaries of existing published feedback. These are not independently
// documented project case studies; no dates, locations or specifications added.
const stories: Story[] = [
 { slug: 'antstack-welcome-kits', client: 'AntStack', title: 'A welcome that felt considered.', summary: 'Employee welcome kits, custom branding and on-time delivery, described by AntStack’s operations manager.', products: ['Employee welcome kits'], sourceName: 'Gladwin Bosco', categoryHref: '/employee-welcome-kits-bangalore' },
 { slug: 'infor-corporate-kits', client: 'Infor', title: 'Consistency across 200+ kits.', summary: 'Customer feedback highlights consistency in quality across more than 200 kits ordered through OfNeeds.', products: ['Corporate gift kits'], quantity: '200+ kits, reported by the customer', sourceName: 'Bhuweneshwari', categoryHref: '/custom-gift-sets' },
 { slug: 'amazon-bazaar-tshirts', client: 'Amazon Bazaar', title: 'T-shirts. Attentive support.', summary: 'Feedback on comfortable T-shirts and prompt, helpful order coordination.', products: ['T-shirts'], sourceName: 'Anand Sunkad', categoryHref: '/corporate-apparel' }
];
export const customerStories = stories.flatMap(story => {
 const source = testimonials.find(item => item.name === story.sourceName);
 return source ? [{ ...story, quote: source.quote, author: source.name, role: source.role }] : [];
});
