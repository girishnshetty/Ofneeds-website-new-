// Original products, welcome-kit packages, testimonials and client logos. Other original data is archived in docs/legacy-data.json.

type Kit = {
	name: string;
	price: string;
	description: string;
	inclusions: string[];
	highlight: boolean;
};
type Product = { name: string; image: string; description: string };
type Testimonial = { quote: string; name: string; role: string };
type Logo = { src: string; alt: string };



export const welcomeKits: Kit[] = [
	{
		name: 'Package 1',
		price: '₹599',
		description: 'A high-value starter kit for everyday onboarding moments.',
		inclusions: ['T-Shirt', 'Premium NoteBook', 'Pen', 'Welcome Card'],
		highlight: false
	},
	{
		name: 'Package 2',
		price: '₹1,099',
		description: 'An elevated welcome experience for high-impact first impressions.',
		inclusions: ['Polo T-Shirt', 'Executive NoteBook', 'Pen', 'Sipper Bottle'],
		highlight: true
	}
];

export const products: Product[] = [
	{
		name: 'T-Shirts',
		image: '/product-images/tshirt.png',
		description: 'Soft, durable, and ready for custom branding.'
	},
	{
		name: 'Notebooks',
		image: '/product-images/notebook.png',
		description: 'Practical desk essentials with premium finish.'
	},
	{
		name: 'Caps',
		image: '/product-images/caps.png',
		description: 'Simple, wearable branding for teams and events.'
	},
	{
		name: 'Trophies',
		image: '/product-images/trophy.png',
		description: 'Celebrate milestones with thoughtful recognition.'
	},
	{
		name: 'Steel Sipper Bottle',
		image: '/product-images/steel-sipper-bottle.png',
		description: 'Utility-first gift that stays with your users daily.'
	},
	{
		name: 'Jackets',
		image: '/product-images/jacket.png',
		description: 'Comfortable layers for teams on the move.'
	},
	{
		name: 'Eco Tote Bag',
		image: '/product-images/eco-tote-bag.png',
		description: 'A reusable carry bag for everyday routines.'
	},
	{
		name: 'Backpacks',
		image: '/product-images/back-bags.png',
		description: 'Premium carry solutions for work and travel.'
	}
];


export const testimonials: Testimonial[] = [
	{
		quote:
			'The quality of their welcome kits was outstanding. Every new hire loved their onboarding package. The custom branding was flawless and delivery was right on time.',
		name: 'Gladwin Bosco',
		role: 'Operations Manager, AntStack'
	},
	{
		quote:
			'Best vendor for merchandise. On-time delivery, great quality, and their account manager is super responsive. Highly recommend for bulk corporate orders.',
		name: 'Krishna Murthy',
		role: 'Sri Value Tech'
	},
	{
		quote: "We've ordered 200+ kits through OfNeeds and the consistency in quality is remarkable.",
		name: 'Bhuweneshwari',
		role: 'Infor'
	},
	{
		quote:
			'Quick and prompt delivery. A good place for a vast range of corporate gifting solutions.',
		name: 'Prashanth',
		role: 'Wheels Box'
	},
	{
		quote:
			'Very Happy to be working with the team, the team is proactive and efficient in catering to all the requirement.',
		name: 'Pallavi',
		role: 'AVO Automation'
	},
	{
		quote:
			'Loved the T-shirts! Super comfortable and nice. Girish was extremely prompt and helpful with the order.',
		name: 'Anand Sunkad',
		role: 'Amazon Bazaar'
	},
	{
		quote:
			'Very Smooth process, with Multiple options for customized T-shirt, just one hub for corporate personalized/customized products. Loved the service a lot and highly recommended.',
		name: 'Palanisamy Kumarasamy',
		role: 'Socure India Private Limited'
	},
	{
		quote:
			'Very Happy to be working with the team, the team is proactive and efficient in catering to all the requirement.',
		name: 'Vinod',
		role: 'Integration Wizards Solutions Pvt Ltd'
	}
];

export const logos: Logo[] = [
	{ src: '/company-logos/amazon-logo.png', alt: 'Amazon logo' },
	{ src: '/company-logos/antstact.png', alt: 'AntStack logo' },
	{ src: '/company-logos/infor.png', alt: 'Infor logo' },
	{ src: '/company-logos/sri-value-tech.png', alt: 'Sri Value Tech logo' },
	{ src: '/company-logos/valzy.png', alt: 'Valzy logo' },
	{ src: '/company-logos/avo.jpg', alt: 'AVO logo' },
	{ src: '/company-logos/source.webp', alt: 'Source logo' },
	{ src: '/company-logos/icon-192.png', alt: 'Client logo' }
];
