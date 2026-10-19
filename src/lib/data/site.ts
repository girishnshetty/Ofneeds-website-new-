export const site = {
	name: 'OfNeeds',
	origin: 'https://www.ofneeds.com',
	email: 'hello@ofneeds.com',
	phone: '+91 70907 95666',
	phoneLink: '+917090795666',
	navbarLogo: '/ofneeds-glossy-logo.png',
	whatsapp: '917090795666',
	location: 'Bengaluru, Karnataka, India',
	founded: '2020',
	tally: 'https://tally.so/r/OD0ZV7',
	tagline: 'Gifts That Speak Your Brand',
	socialImage: '/optimized/hero-1066.webp'
} as const;
export const contactNumbers = [
	{ display: site.phone, href: site.phoneLink },
	{ display: '+91 97391 95666', href: '+919739195666' }
] as const;
export const whatsappMessage =
	"Hi OfNeeds, I'm looking for corporate gifting options.\n\nCompany:\nProduct Requirement:\nQuantity:\nBudget:\nDelivery Date:";
export const whatsappUrl = (message = whatsappMessage) =>
	`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
export const homeTitle =
	'Corporate Gifting Company in Bangalore | OfNeeds';
export const homeDescription =
	'OfNeeds supplies corporate gifts, employee welcome kits and branded merchandise in Bangalore and Bengaluru, with custom branding and delivery across India.';
export const serviceAreas = [
	'Whitefield',
	'Electronic City',
	'HSR Layout',
	'Koramangala',
	'Bellandur',
	'Marathahalli',
	'Hebbal',
	'Manyata Tech Park',
	'MG Road'
];
export const benefits = [
	{
		icon: 'tag',
		title: 'Competitive Corporate Pricing',
		text: 'Explore options around your quantity, product mix and budget.'
	},
	{
		icon: 'grid',
		title: 'Wide Product Selection',
		text: 'Apparel, work essentials and gift sets through one gifting partner.'
	},
	{
		icon: 'pen',
		title: 'Custom Branding',
		text: 'Put your identity on the details, from logo placement to packaging.'
	},
	{
		icon: 'chat',
		title: 'Dedicated Support',
		text: 'A team to help with product choices and order coordination.'
	},
	{
		icon: 'check',
		title: 'Quality Checked Before Dispatch',
		text: 'Products and customization checked before your order goes out.'
	},
	{
		icon: 'truck',
		title: 'Pan-India Delivery',
		text: 'Plan delivery around your offices, teams and gifting occasion.'
	},
	{
		icon: 'box',
		title: 'Bulk Order Support',
		text: 'Coordinate merchandise for onboarding, events and company programmes.'
	},
	{
		icon: 'settings',
		title: 'Flexible Customization',
		text: 'Build a product mix around the people who will receive it.'
	}
];
export const steps = [
	{ title: 'Share Your Requirement', text: 'Quantity, budget, products, branding and timeline.' },
	{ title: 'Receive Curated Options', text: 'Products selected according to your requirements.' },
	{ title: 'Approve Branding', text: 'Review logo placement and digital mockups.' },
	{ title: 'Production & Quality Check', text: 'Customization, packing and inspection.' },
	{ title: 'Delivery', text: 'Bulk or multi-location delivery based on the order.' }
];
// Policy-dependent answers deliberately avoid unconfirmed quantities, prices or deadlines.
export const faqs = [
	{
		question: 'Does the advertised price include GST, branding and shipping?',
		answer: 'Confirm the complete cost in your written quotation. Product prices, branding, packaging, applicable taxes and delivery charges depend on the selected items, quantities and locations.'
	},
	{
		question: 'How is artwork approved before production?',
		answer: 'Share the logo and branding requirements with our team. Review the proposed placement, size and colour treatment for the selected product, and confirm the artwork version before production is approved.'
	},
	{
		question: 'Can one enquiry include several products and quantities?',
		answer: 'Yes. Add product selections to your quote shortlist, set a quantity for each, and include branding, budget and delivery details in one brief. It is a request for a manual quotation, with no automatic order or stock reservation.'
	},
	{
		question: 'What is the minimum order quantity?',
		answer:
			'Minimum quantities depend on the product and branding method. Share your preferred items and quantity so our team can confirm the options for your order.'
	},
	{
		question: 'Can you customize products with our company logo?',
		answer:
			'Yes. OfNeeds supports custom branding. The available technique, logo placement and artwork requirements are confirmed for the selected product before production.'
	},
	{
		question: 'Do you provide employee welcome kits?',
		answer:
			'Yes. Our existing welcome-kit packages include a ₹499 kit and a ₹999 kit. You can also discuss a tailored kit with apparel, stationery, drinkware and other work essentials.'
	},
	{
		question: 'Can we build our own gift kit?',
		answer:
			'Yes. Share your preferred products, packaging, budget and employee count. Our team will help you put together a suitable selection and confirm pricing.'
	},
	{
		question: 'Do you deliver across India?',
		answer:
			'Yes. We support corporate orders across India. Delivery arrangements and charges are confirmed against your locations, quantity and required date.'
	},
	{
		question: 'Can you deliver kits directly to employees?',
		answer:
			'Share the number of delivery locations with your enquiry. Our team will confirm whether individual delivery is available for your order and provide the associated logistics details.'
	},
	{
		question: 'How long does corporate gifting production take?',
		answer:
			'Timelines vary by product, quantity, branding and stock availability. Include your required delivery date so we can confirm a realistic production and dispatch plan before you approve the order.'
	},
	{
		question: 'Can you source branded products?',
		answer:
			'Tell us the brands and models you have in mind. Availability and sourcing options are confirmed for each enquiry.'
	},
	{
		question: 'Can you work within a fixed per-employee budget?',
		answer:
			'Yes. Share your per-person budget and quantity. We can discuss product combinations and clarify branding, packaging and delivery costs in your quotation.'
	},
	{
		question: 'How do I request a corporate quotation?',
		answer:
			'Use the enquiry form, call +91 70907 95666 or +91 97391 95666, email hello@ofneeds.com or send your requirement on WhatsApp. Include the products, quantity, budget and delivery date for a useful quotation.'
	}
];
