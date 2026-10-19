import { products, type Product } from './product-types';
import { welcomeKits } from './legacy';
import { photography } from './photography';

// Product types are enquiry selections, not individual stocked models. Add verified specifications here.
export const productSelections: Product[] = [
	...products,
	...welcomeKits.map((kit, index): Product => ({
		id: `welcome-kit-${index + 1}`, slug: `welcome-kit-${index + 1}`,
		name: `Welcome Kit · ${kit.name}`, description: kit.description,
		category: 'Employee Welcome Kits', categoryHref: '/employee-welcome-kits-bangalore',
		kind: 'package', price: Number(kit.price.replace(/[^0-9]/g, '')), priceVerified: true,
		inclusions: kit.inclusions, image: photography.welcome.src, photo: photography.welcome,
		href: `/products/welcome-kit-${index + 1}`
	}))
];
export const productFor = (id: string) => productSelections.find((product) => product.id === id);
export const budgetRanges = [
	{ id: 'under-500', label: 'Under ₹500', min: 0, max: 500 },
	{ id: '500-1000', label: '₹500–₹1,000', min: 500, max: 1000 },
	{ id: '1000-2000', label: '₹1,000–₹2,000', min: 1000, max: 2000 },
	{ id: '2000-5000', label: '₹2,000–₹5,000', min: 2000, max: 5000 },
	{ id: 'above-5000', label: 'Above ₹5,000', min: 5000, max: Infinity }
];
export function matchesBudget(product: Product, range: string) {
	const budget = budgetRanges.find((item) => item.id === range);
	return !budget || (product.priceVerified && product.price !== null && product.price >= budget.min && product.price < budget.max);
}
