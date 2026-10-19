import { seoLandings } from './seo-landings';
import { photography, type Photography, type PhotoKey } from './photography';
export { products, type Product } from './product-types';
export { categories, type Category } from './categories';
const landingPhotoKeys: Record<string, PhotoKey> = {
	'corporate-gifting-bangalore': 'custom',
	'employee-welcome-kits-bangalore': 'welcome',
	'corporate-tshirts-bangalore': 'apparel',
	'corporate-jackets-bangalore': 'jackets',
	'corporate-drinkware': 'drinkware',
	'corporate-notebooks-diaries': 'notebooks',
	'corporate-trophies-awards': 'awards',
	'corporate-backpacks': 'backpacks',
	'tech-corporate-gifts': 'tech',
	'employee-gifts': 'welcome',
	'client-gifts': 'executive',
	'event-merchandise': 'events',
	'festive-corporate-gifts': 'festive',
	'corporate-apparel': 'apparel',
	'eco-friendly-corporate-gifts': 'eco',
	'custom-gift-sets': 'custom'
};
export type LandingPage = {
	slug: string;
	title: string;
	description: string;
	h1: string;
	intro: string;
	eyebrow: string;
	image: string;
	imageAlt: string;
	photo: Photography;
	productNames: string[];
	sections: { title: string; text: string }[];
	checklist: string[];
	related: string[];
};
const make = (
	slug: string,
	title: string,
	description: string,
	h1: string,
	intro: string,
	productNames: string[],
	sections: [string, string][],
	checklist: string[],
	related: string[]
): LandingPage => {
	const photo = photography[landingPhotoKeys[slug]];
	return {
		slug,
		title: title + ' | OfNeeds',
		description,
		h1,
		intro,
		eyebrow: 'Corporate gifting solutions',
		image: photo.src,
		photo,
		imageAlt: photo.alt,
		productNames,
		sections: sections.map(([title, text]) => ({ title, text })),
		checklist,
		related
	};
};
export const landingPages: LandingPage[] = [
	make(
		'corporate-gifting-bangalore',
		'Corporate Gifting Company in Bangalore',
		'Plan corporate gifts in Bengaluru with OfNeeds. Explore branded apparel, employee kits, drinkware, awards and custom merchandise for teams across India.',
		'Corporate Gifting Company in Bangalore',
		'One partner for the products, branding and packing behind your next corporate gifting programme. Based in Bengaluru, OfNeeds supports HR, procurement, admin and marketing teams across India.',
		['T-Shirts', 'Notebooks', 'Steel Sipper Bottle', 'Backpacks'],
		[
			[
				'A useful starting point for your buying team',
				'Begin with the occasion, recipient group and budget. An onboarding programme may need repeatable kits; an event may call for apparel and practical merchandise. We help you compare a suitable selection before you commit.'
			],
			[
				'Coordinate local and national requirements',
				'From Bengaluru offices to teams in other cities, delivery planning starts with your actual locations and required date. Share whether you need one bulk dispatch or multiple destinations so logistics can be included in the quotation.'
			],
			[
				'Bring the details into one brief',
				'Product specifications, artwork, packaging and delivery all affect the final order. A clear brief helps your team compare options and obtain internal approval without relying on a headline price alone.'
			]
		],
		[
			'Occasion and recipient profile',
			'Quantity and per-person budget',
			'Brand artwork and packaging needs',
			'Delivery locations and required date'
		],
		['employee-welcome-kits-bangalore', 'corporate-apparel', 'employee-gifts', 'client-gifts']
	),
	make(
		'employee-welcome-kits-bangalore',
		'Employee Welcome Kits in Bangalore | Custom Joining Kits',
		'Create custom employee welcome kits in Bangalore with OfNeeds. Compare existing ₹599 and ₹1,099 packages or build a joining kit around your team and budget.',
		'Employee Welcome Kits in Bangalore',
		'Make a new colleague’s first day feel considered. Choose an existing package or build an onboarding kit around your culture, budget and everyday work essentials.',
		['T-Shirts', 'Notebooks', 'Steel Sipper Bottle', 'Backpacks'],
		[
			[
				'Two existing packages, a flexible starting point',
				'The ₹599 package includes a T-Shirt, Premium NoteBook, Pen and Welcome Card. The ₹1,099 package includes a Polo T-Shirt, Executive NoteBook, Pen and Sipper Bottle. Confirm current specifications and the complete order quotation with our team.'
			],
			[
				'Plan for your onboarding rhythm',
				'For recurring joining dates, share your expected quantities and required dates. Apparel sizes, welcome-card content and packaging can then be discussed together rather than left until dispatch.'
			],
			[
				'Build your own welcome experience',
				'Choose the items that fit how your team works. Add a notebook and bottle for the desk, apparel for belonging or a bag for the commute. Product availability and customization are confirmed during enquiry.'
			]
		],
		[
			'New-joiner count and joining dates',
			'Apparel size breakdown',
			'Logo files and welcome-card content',
			'Packaging and delivery destinations'
		],
		[
			'corporate-tshirts-bangalore',
			'corporate-drinkware',
			'corporate-notebooks-diaries',
			'corporate-backpacks'
		]
	),
	make(
		'corporate-tshirts-bangalore',
		'Corporate T-Shirts in Bangalore | Custom Branded T-Shirts',
		'Source custom corporate T-shirts and polos in Bangalore with OfNeeds. Discuss fabrics, sizes, logo placement and bulk requirements for teams and events.',
		'Corporate T-Shirts in Bangalore',
		'Create a consistent team identity with branded T-shirts and polos for onboarding, everyday wear and company events.',
		['T-Shirts', 'Caps', 'Jackets'],
		[
			[
				'Choose for the occasion and comfort',
				'A company event and an everyday team uniform can call for different fits and fabrics. Tell us where and how the T-shirts will be worn so the shortlisted options reflect the actual use.'
			],
			[
				'Get the branding details right',
				'Share your logo artwork, preferred colors and placement. Available printing or embroidery methods depend on the selected garment and design, and are confirmed before production.'
			],
			[
				'Prepare a complete size breakdown',
				'Collect sizes and quantities before finalizing the order. If the apparel is part of a welcome kit, coordinate the size list with the packing plan to make distribution easier.'
			]
		],
		[
			'T-shirt or polo preference',
			'Fabric, color and size requirements',
			'Logo placement and artwork',
			'Event date and delivery location'
		],
		['employee-welcome-kits-bangalore', 'corporate-jackets-bangalore', 'event-merchandise']
	),
	make(
		'corporate-jackets-bangalore',
		'Corporate Jackets in Bangalore | Customized Employee Jackets',
		'Plan branded corporate jackets in Bangalore with OfNeeds. Explore employee outerwear, customization and bulk ordering around your team’s requirements.',
		'Corporate Jackets in Bangalore',
		'Branded layers for teams on the move. Discuss corporate jackets, hoodies and sweatshirts around your people, working environment and occasion.',
		['Jackets', 'T-Shirts', 'Backpacks'],
		[
			[
				'Match the layer to the setting',
				'Office commutes, outdoor events and travel have different needs. Share the expected use, garment style and fabric preferences so suitable outerwear can be discussed.'
			],
			[
				'Keep the brand presentation considered',
				'A sleeve detail or chest logo creates a different effect from a large back print. Confirm placement, artwork and the available branding method for your chosen garment.'
			],
			[
				'Coordinate sizing before approval',
				'Use a team size breakdown and clarify fit preferences early. Quantities, personalization and delivery arrangements are included in the order discussion.'
			]
		],
		[
			'Jacket, hoodie or sweatshirt style',
			'Size breakdown and fabric preferences',
			'Branding locations',
			'Quantity and required delivery date'
		],
		['corporate-tshirts-bangalore', 'employee-gifts', 'corporate-backpacks']
	),
	make(
		'corporate-drinkware',
		'Corporate Drinkware & Customized Bottles',
		'Explore corporate drinkware, sipper bottles, water bottles and mugs with OfNeeds. Request custom branding and bulk pricing for employees, clients and events.',
		'Corporate Drinkware & Customized Bottles',
		'Useful gifts that become part of the everyday. Build a drinkware selection for desks, commutes, employee kits or company events.',
		['Steel Sipper Bottle', 'Notebooks', 'T-Shirts'],
		[
			[
				'Start with how it will be used',
				'Compare the recipient’s routine with your preferred bottle, sipper or mug format. Capacity, material and care requirements matter as much as the appearance.'
			],
			[
				'Review the artwork on the chosen surface',
				'Logo placement and available customization methods vary by product. Review the mockup for the selected item before production approval.'
			],
			[
				'Include packing in the brief',
				'Drinkware may be supplied individually or inside a larger kit. Share your distribution plan so packaging and delivery can be quoted together.'
			]
		],
		[
			'Bottle, sipper or mug format',
			'Preferred capacity and material',
			'Logo artwork and quantity',
			'Individual or kit packaging'
		],
		['employee-welcome-kits-bangalore', 'client-gifts', 'event-merchandise']
	),
	make(
		'corporate-notebooks-diaries',
		'Corporate Notebooks & Customized Diaries',
		'Source branded notebooks, diaries, pens and stationery from OfNeeds. Plan practical corporate gifts with custom artwork and bulk order support.',
		'Corporate Notebooks & Diaries',
		'For meeting notes, good ideas and everyday plans. Create a useful stationery selection that carries your brand into the working day.',
		['Notebooks', 'Steel Sipper Bottle', 'Backpacks'],
		[
			[
				'Decide the format first',
				'Notebook size, page layout and cover style affect how the gift is used. A diary for planning and a notebook for meetings serve different needs; include that context in your enquiry.'
			],
			[
				'Pair stationery with the right details',
				'Combine a notebook with a pen, welcome card or drinkware to create a coherent set. Customization and packaging options are confirmed for the selected items.'
			],
			[
				'Prepare your cover artwork',
				'Share a usable logo file, brand colors and any approved text. Review the proposed branding before your order moves to production.'
			]
		],
		[
			'Notebook or diary format',
			'Page layout and cover preference',
			'Brand artwork and accompanying items',
			'Quantity and packaging needs'
		],
		['employee-welcome-kits-bangalore', 'client-gifts', 'custom-gift-sets']
	),
	make(
		'corporate-trophies-awards',
		'Corporate Trophies & Awards in Bangalore',
		'Create corporate trophies and recognition awards with OfNeeds in Bangalore. Discuss award styles, personalization, event dates and bulk requirements.',
		'Corporate Trophies & Awards',
		'Make recognition feel personal. Plan trophies and awards for employee milestones, company events and team achievements.',
		['Trophies', 'Notebooks', 'Caps'],
		[
			[
				'Choose for the recognition moment',
				'An annual company award and a project milestone may need different styles. Tell us about the event, presentation format and recipient count to start the selection.'
			],
			[
				'Check every personalized detail',
				'Names, designations, award titles and dates need careful review. Consolidate the final recipient list and approve the artwork before personalization.'
			],
			[
				'Plan around the presentation date',
				'Share the event date and delivery location at enquiry. The team will confirm feasible production and packing arrangements for the selected award.'
			]
		],
		[
			'Award occasion and preferred style',
			'Recipient names and award text',
			'Brand artwork and quantity',
			'Presentation date and delivery location'
		],
		['employee-gifts', 'event-merchandise', 'client-gifts']
	),
	make(
		'corporate-backpacks',
		'Corporate Backpacks & Branded Laptop Bags',
		'Explore corporate backpacks, laptop bags and travel merchandise with OfNeeds. Plan branded bags for employees, onboarding kits and business events.',
		'Corporate Backpacks & Travel Bags',
		'Practical carry solutions for the working day. Discuss backpacks, laptop bags and totes around your team’s commute, devices and travel needs.',
		['Backpacks', 'Eco Tote Bag', 'Jackets'],
		[
			[
				'Specify what the bag needs to carry',
				'Share the expected laptop size, daily use and storage preferences. The product selection should reflect how recipients will actually use the bag.'
			],
			[
				'Consider the branding surface',
				'Logo size and placement depend on the bag material and construction. Available customization methods and artwork are reviewed for the chosen product.'
			],
			[
				'Combine with everyday essentials',
				'A backpack can become the outer packaging for a welcome kit or a standalone gift. Include the complete product mix in your enquiry to coordinate packing.'
			]
		],
		[
			'Backpack, laptop bag or tote preference',
			'Laptop dimensions and storage needs',
			'Branding and quantity',
			'Standalone gift or welcome-kit inclusion'
		],
		['employee-welcome-kits-bangalore', 'tech-corporate-gifts', 'corporate-jackets-bangalore']
	),
	make(
		'tech-corporate-gifts',
		'Tech Corporate Gifts & Desk Accessories',
		'Discuss tech accessories and desk gifts with OfNeeds. Build a useful corporate selection around compatibility, branding, quantity and budget.',
		'Tech Accessories for Modern Teams',
		'Thoughtful additions to the workspace. Share the tech accessories and desk essentials you want to include, and we will confirm suitable sourcing options.',
		['Notebooks', 'Backpacks', 'Steel Sipper Bottle'],
		[
			[
				'Define the use before choosing the accessory',
				'Desk accessories, device stands and other tech gifting items should suit the recipient’s setup. Include intended use and any compatibility requirements in the brief.'
			],
			[
				'Confirm specifications before ordering',
				'For electronic products, request the model, technical specifications and applicable warranty information as part of selection. Availability and supplier details are confirmed per enquiry.'
			],
			[
				'Build a practical workspace set',
				'Combine confirmed accessories with a notebook, bag or drinkware. The product image here illustrates an existing merchandise selection; exact tech products are quoted after sourcing confirmation.'
			]
		],
		[
			'Accessory type and intended use',
			'Required device compatibility',
			'Preferred model or brand, if any',
			'Budget, quantity and delivery date'
		],
		['employee-welcome-kits-bangalore', 'corporate-backpacks', 'client-gifts']
	),
	make(
		'employee-gifts',
		'Employee Gifts & Corporate Recognition Merchandise',
		'Plan employee gifts with OfNeeds for onboarding, recognition and company milestones. Explore practical branded merchandise around your team and budget.',
		'Employee Gifts That Feel Considered',
		'Celebrate the people behind your business. Build a gifting selection for joining days, achievements and company moments without losing sight of practical use.',
		['T-Shirts', 'Notebooks', 'Steel Sipper Bottle', 'Trophies'],
		[
			[
				'Start with the employee moment',
				'A first-day kit, milestone gift and recognition award have different roles. Defining the occasion helps you choose items that feel relevant rather than simply filling a box.'
			],
			[
				'Make the budget work as a whole',
				'Include branding, packaging and delivery when discussing your per-person budget. That gives your buying team a clearer comparison between product combinations.'
			],
			[
				'Plan distribution with your team',
				'Confirm recipient count, apparel sizes where relevant and delivery locations. For multiple locations, ask the team to confirm a suitable dispatch arrangement.'
			]
		],
		[
			'Employee occasion and recipient count',
			'Per-person budget',
			'Personalization and size needs',
			'Distribution plan'
		],
		['employee-welcome-kits-bangalore', 'corporate-trophies-awards', 'corporate-jackets-bangalore']
	),
	make(
		'client-gifts',
		'Client Gifts & Executive Corporate Gifting',
		'Create thoughtful client and executive gifts with OfNeeds. Discuss branded notebooks, drinkware, bags and custom gift sets for business relationships.',
		'Client & Executive Gifts',
		'Considered merchandise for the relationships that matter. Plan a professional selection for client meetings, business milestones and partner appreciation.',
		['Notebooks', 'Steel Sipper Bottle', 'Backpacks'],
		[
			[
				'Choose around the recipient and occasion',
				'A client meeting and a festive appreciation gift call for different choices. Share the recipient profile, business context and budget to guide selection.'
			],
			[
				'Keep the presentation understated',
				'Thoughtful logo placement, a clear note and considered packaging can create a cohesive gift. Discuss each detail with the product mix so the presentation feels intentional.'
			],
			[
				'Confirm branded product sourcing',
				'If you have specific brands in mind, request availability for the exact items.'
			]
		],
		[
			'Recipient profile and gifting occasion',
			'Budget and quantities',
			'Preferred brands or products',
			'Packaging and delivery needs'
		],
		['corporate-notebooks-diaries', 'corporate-drinkware', 'custom-gift-sets']
	),
	make(
		'event-merchandise',
		'Custom Event Merchandise & Corporate Event Gifts',
		'Plan branded event merchandise with OfNeeds. Source T-shirts, caps, bags, drinkware and stationery for conferences, team gatherings and company events.',
		'Event Merchandise, Made for Your Brand',
		'Carry your identity through the event. Coordinate practical merchandise for conferences, company gatherings, launches and team programmes.',
		['Caps', 'T-Shirts', 'Eco Tote Bag', 'Notebooks'],
		[
			[
				'Build around the event experience',
				'Think about arrival, sessions and what attendees will take home. A coherent selection of apparel, stationery and bags supports the experience without unnecessary items.'
			],
			[
				'Collect the production details early',
				'Share approved event artwork, colors, attendance count and apparel sizes. Include sponsor or partner artwork only when you have permission to use it.'
			],
			[
				'Work backward from the event date',
				'The event date determines the planning window. Confirm selection, branding approval and required delivery together so the team can advise on feasibility.'
			]
		],
		[
			'Event date and attendee count',
			'Approved event artwork',
			'Apparel sizes and product quantities',
			'Venue and required delivery date'
		],
		['corporate-tshirts-bangalore', 'corporate-drinkware', 'corporate-backpacks']
	),
	make(
		'festive-corporate-gifts',
		'Festive Corporate Gifts for Teams & Clients',
		'Plan festive corporate gifts with OfNeeds for employees and clients. Discuss customized gift sets, merchandise, packaging and delivery around your budget.',
		'Festive Gifting, with a Personal Touch',
		'Bring your brand into the season with a thoughtful product selection for employees, clients and partners. Build around the occasion and the people receiving it.',
		['Notebooks', 'Steel Sipper Bottle', 'Eco Tote Bag'],
		[
			[
				'Choose a useful festive selection',
				'Share your preferred gifting theme and recipient profile. Available merchandise and custom sets are discussed around your budget; product images show illustrative existing items.'
			],
			[
				'Plan packaging and your message',
				'A greeting card, brand detail and considered packing help the gift feel complete. Include approved artwork and any personalized message in the brief.'
			],
			[
				'Allow for seasonal planning',
				'Seasonal demand can affect availability and production. Request a quotation with your quantities and required date, then confirm the schedule before placing the order.'
			]
		],
		[
			'Occasion and recipient groups',
			'Budget and quantity',
			'Greeting-card and packaging requirements',
			'Delivery destinations and date'
		],
		['client-gifts', 'employee-gifts', 'custom-gift-sets']
	),
	make(
		'corporate-apparel',
		'Corporate Apparel & Branded Team Clothing',
		'Explore corporate T-shirts, polos, jackets, hoodies and sweatshirts with OfNeeds. Plan custom branded apparel for employees, welcome kits and events.',
		'Corporate Apparel That Carries Your Identity',
		'From everyday polos to team jackets, build an apparel selection that fits the occasion, your people and your brand.',
		['T-Shirts', 'Jackets', 'Caps'],
		[
			[
				'Choose the garment for its purpose',
				'T-shirts, polos, jackets, hoodies and sweatshirts offer different ways to dress a team. Tell us about the use, fabric preferences and required colors.'
			],
			[
				'Bring sizing and branding together',
				'A clear size breakdown and approved logo artwork help align selection, customization and packing. Confirm the branding method for each garment before production.'
			]
		],
		[
			'Garment styles and quantities',
			'Fabric and color preferences',
			'Team size breakdown',
			'Logo artwork and delivery date'
		],
		['corporate-tshirts-bangalore', 'corporate-jackets-bangalore', 'event-merchandise']
	),
	make(
		'eco-friendly-corporate-gifts',
		'Reusable Corporate Gifts & Eco-Friendly Gift Options',
		'Explore reusable corporate gifting options with OfNeeds, including tote bags, notebooks and drinkware. Confirm materials and product specifications during enquiry.',
		'Reusable Gifts for Everyday Life',
		'Consider products that recipients can use again: bags for the commute, bottles for the desk and stationery for daily work.',
		['Eco Tote Bag', 'Steel Sipper Bottle', 'Notebooks'],
		[
			[
				'Focus on practical reuse',
				'A useful tote or bottle can become part of the recipient’s routine. Start with practical use, then confirm material, care requirements and branding options.'
			],
			[
				'Ask for specific material information',
				'Environmental claims should be supported by the actual product specification. Ask our team for available material information; no sustainability certification is claimed on this page.'
			]
		],
		[
			'Intended use and preferred materials',
			'Product specifications to confirm',
			'Branding and quantity',
			'Packaging preferences'
		],
		['corporate-drinkware', 'corporate-backpacks', 'custom-gift-sets']
	),
	make(
		'custom-gift-sets',
		'Custom Corporate Gift Sets & Build Your Own Kits',
		'Build custom corporate gift sets with OfNeeds. Combine apparel, stationery, bags and drinkware around your recipient, brand, quantity and budget.',
		'Custom Corporate Gift Sets',
		'Choose the occasion, set the budget and build a product mix around the people receiving it. We help bring the selection, branding and packing together.',
		['T-Shirts', 'Notebooks', 'Steel Sipper Bottle', 'Backpacks'],
		[
			[
				'Start with a clear brief',
				'Specify the recipient, occasion, quantity and complete per-person budget. Include any must-have items and products you would prefer to avoid.'
			],
			[
				'Make the pieces feel like one gift',
				'Coordinate colors, logo placement, a message card and packaging. Confirm the shortlisted items and artwork before production begins.'
			],
			[
				'Request the complete quotation',
				'Prices for custom sets depend on the selected products, branding and logistics. New package prices are provided through enquiry rather than estimated on this website.'
			]
		],
		[
			'Occasion and recipient group',
			'Must-have products and total budget',
			'Branding and packaging brief',
			'Quantity and delivery plan'
		],
		['employee-welcome-kits-bangalore', 'client-gifts', 'festive-corporate-gifts']
	)
];
landingPages.push(...seoLandings);
export const pageFor = (slug: string) => landingPages.find((page) => page.slug === slug);
