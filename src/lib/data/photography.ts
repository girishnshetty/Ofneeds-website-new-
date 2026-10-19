export type Photography = {
	src: string;
	srcset: string;
	width: number;
	height: number;
	alt: string;
	position: string;
	fit: 'cover' | 'contain';
};
export const photography = {
	catalogueDrinkware: { src: '/catalogue-images/drinkware-900.webp', srcset: '/catalogue-images/drinkware-480.webp 480w, /catalogue-images/drinkware-900.webp 900w', width: 900, height: 637, alt: 'Bottles, tumblers and mugs from the supplied UG Drinkware catalogue', position: '50% 50%', fit: 'contain' },
	cataloguePens: { src: '/catalogue-images/pens-900.webp', srcset: '/catalogue-images/pens-480.webp 480w, /catalogue-images/pens-900.webp 900w', width: 900, height: 637, alt: 'Writing instruments from the supplied UG Pens catalogue', position: '50% 50%', fit: 'contain' },
	welcome: {
		src: '/optimized/hero-800.webp',
		srcset:
			'/optimized/hero-480.webp 480w, /optimized/hero-800.webp 800w, /optimized/hero-1066.webp 1066w',
		width: 1066,
		height: 1066,
		alt: 'Corporate employee welcome kit with a polo shirt, backpack, bottle, notebook, pen and desk accessories',
		position: '50% 50%',
		fit: 'contain'
	},
	apparel: {
		src: '/photography/apparel-900.webp',
		srcset:
			'/photography/apparel-480.webp 480w, /photography/apparel-900.webp 900w, /photography/apparel-1440.webp 1440w',
		width: 900,
		height: 600,
		alt: 'Illustrative black and sage cotton T-shirts styled on a light surface',
		position: '50% 50%',
		fit: 'cover'
	},
	drinkware: {
		src: '/photography/drinkware-900.webp',
		srcset:
			'/photography/drinkware-480.webp 480w, /photography/drinkware-900.webp 900w, /photography/drinkware-1440.webp 1440w',
		width: 900,
		height: 600,
		alt: 'Illustrative stainless steel reusable bottle in a clean tabletop setting',
		position: '50% 50%',
		fit: 'cover'
	},
	notebooks: {
		src: '/catalogue-images/notebooks-900.webp',
		srcset: '/catalogue-images/notebooks-480.webp 480w, /catalogue-images/notebooks-900.webp 900w',
		width: 900,
		height: 900,
		alt: 'Black and ivory notebooks with matching pens from the iScape catalogue',
		position: '50% 50%',
		fit: 'contain'
	},
	awards: {
		src: '/photography/awards-900.webp',
		srcset:
			'/photography/awards-480.webp 480w, /photography/awards-900.webp 900w, /photography/awards-1440.webp 1440w',
		width: 900,
		height: 1350,
		alt: 'Illustrative gold recognition trophies in a softly lit arrangement',
		position: '50% 65%',
		fit: 'cover'
	},
	backpacks: {
		src: '/photography/backpacks-900.webp',
		srcset:
			'/photography/backpacks-480.webp 480w, /photography/backpacks-900.webp 900w, /photography/backpacks-1440.webp 1440w',
		width: 900,
		height: 1350,
		alt: 'Illustrative black backpack and travel bottle on a wooden bench',
		position: '50% 45%',
		fit: 'cover'
	},
	tech: {
		src: '/photography/tech-900.webp',
		srcset:
			'/photography/tech-480.webp 480w, /photography/tech-900.webp 900w, /photography/tech-1440.webp 1440w',
		width: 900,
		height: 1350,
		alt: 'Illustrative headphones and keyboard in a modern workspace',
		position: '50% 25%',
		fit: 'cover'
	},
	executive: {
		src: '/photography/executive-900.webp',
		srcset:
			'/photography/executive-480.webp 480w, /photography/executive-900.webp 900w, /photography/executive-1440.webp 1440w',
		width: 900,
		height: 600,
		alt: 'Illustrative leather notebook and pen on a wooden desk',
		position: '50% 50%',
		fit: 'cover'
	},
	events: {
        src: '/photography/events-900.webp',
        srcset: '/photography/events-480.webp 480w, /photography/events-900.webp 900w, /photography/events-1440.webp 1440w',
        width: 900,
        height: 600,
        alt: 'Colleagues exchanging a coordinated branded merchandise box in a modern office',
        position: '60% 50%',
        fit: 'cover'
    },
	caps: {
		src: '/photography/caps-900.webp',
		srcset:
			'/photography/caps-480.webp 480w, /photography/caps-900.webp 900w, /photography/caps-1440.webp 1440w',
		width: 900,
		height: 1197,
		alt: 'Illustrative unbranded white baseball cap on a light studio background',
		position: '50% 58%',
		fit: 'cover'
	},
	festive: {
		src: '/photography/festive-900.webp',
		srcset:
			'/photography/festive-480.webp 480w, /photography/festive-900.webp 900w, /photography/festive-1440.webp 1440w',
		width: 900,
		height: 900,
		alt: 'Illustrative festive gift box with an arranged selection of sweets',
		position: '50% 20%',
		fit: 'cover'
	},
	eco: {
		src: '/photography/eco-900.webp',
		srcset:
			'/photography/eco-480.webp 480w, /photography/eco-900.webp 900w, /photography/eco-1440.webp 1440w',
		width: 900,
		height: 1200,
		alt: 'Illustrative reusable canvas tote with books and dried flowers',
		position: '50% 75%',
		fit: 'cover'
	},
	custom: {
		src: '/photography/custom-provided-684.webp',
		srcset: '/photography/custom-provided-360.webp 360w, /photography/custom-provided-684.webp 684w',
		width: 684,
		height: 524,
		alt: 'Personalized black gift set with a notebook, wallet, key ring, pen, mug and insulated bottle in a fitted presentation box',
		position: '50% 50%',
		fit: 'contain'
	},
	jackets: {
		src: '/photography/jackets-900.webp',
		srcset:
			'/photography/jackets-480.webp 480w, /photography/jackets-900.webp 900w, /photography/jackets-1440.webp 1440w',
		width: 900,
		height: 1350,
		alt: 'Illustrative black jacket on a hanger in a minimal setting',
		position: '50% 50%',
		fit: 'cover'
	}
} satisfies Record<string, Photography>;
export type PhotoKey = keyof typeof photography;
