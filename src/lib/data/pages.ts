export const contentPages = {
	about: {
		title: 'About OfNeeds | Corporate Gifting Partner Since 2020',
		h1: 'Thoughtful Gifting. Built Around Your Business.',
		description:
			'Meet OfNeeds, a Bengaluru corporate gifting company established in 2020. Product sourcing, custom branding, packaging and corporate fulfilment across India.'
	},
	clients: {
		title: 'Our Clients & Testimonials | OfNeeds',
		h1: 'Relationships That Make the Work Meaningful.',
		description:
			'Explore genuine customer testimonials and existing client logos from OfNeeds corporate gifting projects.'
	},
	brands: {
		title: 'Brands for Corporate Orders | OfNeeds',
		h1: 'The Right Product. The Right Brand.',
		description:
			'Discuss branded product sourcing for corporate orders with OfNeeds. Availability and product specifications are confirmed for each requirement.'
	},
	insights: {
		title: 'Corporate Gifting Insights & Buying Resources | OfNeeds',
		h1: 'A More Considered Approach to Gifting.',
		description:
			'Explore OfNeeds buying resources for welcome kits, team apparel and corporate merchandise. Practical starting points for your next gifting brief.'
	},
	'privacy-policy': {
		title: 'Privacy Information | OfNeeds',
		h1: 'Privacy Information',
		description:
			'How enquiry information is used in the OfNeeds website enquiry, Tally and WhatsApp contact experiences.'
	},
	'terms-and-conditions': {
		title: 'Ordering Terms & Conditions | OfNeeds',
		h1: 'Ordering Terms & Conditions',
		description:
			'Request and review the complete OfNeeds quotation and written order terms before approving a corporate gifting order.'
	}
} as const;
export type ContentSlug = keyof typeof contentPages;
