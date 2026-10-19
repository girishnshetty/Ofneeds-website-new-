import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { validateLead, webhookReady, type Lead } from '$lib/server/leads';
import type { Actions } from './$types';
export const actions: Actions = {
	quote: async ({ request, fetch }) => {
		if (Number(request.headers.get('content-length') || 0) > 32768)
			return fail(413, {
				message: 'This enquiry is too large. Please shorten your additional requirements.'
			});
		let formData: FormData;
		try {
			formData = await request.formData();
		} catch {
			return fail(400, { message: 'Please submit a valid enquiry form.' });
		}
		const parsed = validateLead(formData);
		if (Object.keys(parsed.errors).length)
			return fail(400, {
				errors: parsed.errors,
				values: parsed.values,
				message: 'Please check the highlighted fields.'
			});
		if (!webhookReady(env.LEAD_WEBHOOK_URL))
			return fail(503, {
				values: parsed.values,
				message:
					'Direct submission is currently unavailable. Please use our enquiry form or contact us on WhatsApp.'
			});
		const lead: Lead = {
			leadId: crypto.randomUUID(),
			createdAt: new Date().toISOString(),
			name: parsed.values.name,
			company: parsed.values.company,
			email: parsed.values.email,
			phone: parsed.values.phone,
			productRequirement: parsed.values.productRequirement,
			quantity: parsed.quantity,
			budget: parsed.budget,
			deliveryDate: parsed.values.deliveryDate || null,
			deliveryCity: parsed.values.deliveryCity,
			notes: parsed.values.notes,
			source: parsed.values.source.startsWith('/') ? parsed.values.source : 'website',
			status: 'new'
		};
		try {
			const response = await fetch(env.LEAD_WEBHOOK_URL!, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(env.LEAD_WEBHOOK_TOKEN ? { Authorization: 'Bearer ' + env.LEAD_WEBHOOK_TOKEN } : {})
				},
				body: JSON.stringify(lead),
				signal: AbortSignal.timeout(10000),
				redirect: 'error'
			});
			if (!response.ok) throw new Error('Lead endpoint rejected the enquiry');
			return {
				success: true,
				leadId: lead.leadId,
				message:
					'Your requirement has been received by our team. We will contact you to discuss suitable options.'
			};
		} catch {
			return fail(502, {
				values: parsed.values,
				message:
					'Your enquiry could not be delivered. Please use the enquiry form or contact our team directly.'
			});
		}
	}
};
