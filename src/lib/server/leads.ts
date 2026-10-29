export const leadStatuses = [
	'new',
	'contacted',
	'qualified',
	'quotation_requested',
	'quotation_sent',
	'follow_up',
	'won',
	'lost'
] as const;
export type LeadStatus = (typeof leadStatuses)[number];
export type Lead = {
	enquiryType: 'buyer' | 'supplier' | 'other';
	leadId: string;
	createdAt: string;
	name: string;
	company: string;
	email: string;
	phone: string;
	productRequirement: string;
	quantity: number | null;
	budget: number | null;
	deliveryDate: string | null;
	deliveryCity: string;
	notes: string;
	source: string;
	status: LeadStatus;
	selectedProducts?: { id: string; name: string; quantity: number }[];
	brandingRequirements?: string;
};
export const webhookReady = (value: string | undefined) => {
	try {
		const url = new URL(value || '');
		return (
			!url.username &&
			!url.password &&
			(url.protocol === 'https:' ||
				(url.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)))
		);
	} catch {
		return false;
	}
};
export { validateLead } from '../lead-validation';
