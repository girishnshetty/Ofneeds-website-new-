import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import { validateLead, webhookReady, type Lead } from '$lib/server/leads';
import { limitedFormData, submissions } from '$lib/server/submissions';
import { normalizeItems, quoteSummary } from '$lib/quote-items';
import { productFor } from '$lib/data/products';
import type { Actions } from './$types';
const digest = async (value: string) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
export const actions: Actions = {
 quote: async ({ request, fetch, getClientAddress }) => {
  let address = 'unknown';
  try { address = getClientAddress(); } catch { /* Some adapters do not expose an address. Do not trust forwarded headers. */ }
  if (!submissions.allow(await digest(address))) return fail(429, { message: 'Too many attempts. Please wait ten minutes or contact our team by phone.' });
  let formData: FormData;
  try { formData = await limitedFormData(request); }
  catch (error) { return fail(error instanceof Error && error.message === 'BODY_LIMIT' ? 413 : 400, { message: 'The enquiry could not be read. Keep it below 32 KB and use the form fields provided.' }); }
  let items;
  try {
   const raw = String(formData.get('selectedProducts') || '[]');
   const input = JSON.parse(raw);
   items = normalizeItems(input);
   if (!Array.isArray(input) || input.length > 30 || input.length !== items.length) throw new Error('INVALID_ITEMS');
  } catch { return fail(400, { message: 'Please review your selected products and quantities before sending.' }); }
  const originalRequirement = String(formData.get('productRequirement') || '').trim();
  if (items.length) formData.set('productRequirement', [quoteSummary(items), originalRequirement].filter(Boolean).join('\n\n'));
  const parsed = validateLead(formData);
  // Preserve the editable free-text field without re-appending the shortlist on a retry.
  const values = { ...parsed.values, productRequirement: originalRequirement };
  if (Object.keys(parsed.errors).length) return fail(400, { errors: parsed.errors, values, message: parsed.errors.form || 'Please check the highlighted fields.' });
  if (!webhookReady(env.LEAD_WEBHOOK_URL)) return fail(503, { values, message: 'Direct submission is currently unavailable. Please use our enquiry form or contact us on WhatsApp.' });
  const suppliedKey = String(formData.get('submissionKey') || '');
  if (suppliedKey && !/^[a-zA-Z0-9-]{16,80}$/.test(suppliedKey)) return fail(400, { values, message: 'Please reload the page before submitting your enquiry.' });
  const payload = {
   enquiryType: parsed.values.enquiryType as Lead['enquiryType'],
   name: parsed.values.name, company: parsed.values.company, email: parsed.values.email,
   phone: parsed.values.phone, productRequirement: parsed.values.productRequirement,
   quantity: parsed.quantity, budget: parsed.budget, deliveryDate: parsed.values.deliveryDate || null,
   deliveryCity: parsed.values.deliveryCity, notes: parsed.values.notes,
   brandingRequirements: parsed.values.brandingRequirements,
   selectedProducts: items.map((item) => ({ ...item, name: productFor(item.id)!.name })),
   source: /^\/(?!\/)/.test(parsed.values.source) ? parsed.values.source : 'website', status: 'new' as const
  };
  const fingerprint = await digest(JSON.stringify(payload));
  const key = await digest(parsed.values.email.toLowerCase() + ':' + (suppliedKey || fingerprint));
  try {
   return await submissions.run(key, fingerprint, async () => {
    const lead: Lead = { ...payload, leadId: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const response = await fetch(env.LEAD_WEBHOOK_URL!, {
     method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key, ...(env.LEAD_WEBHOOK_TOKEN ? { Authorization: 'Bearer ' + env.LEAD_WEBHOOK_TOKEN } : {}) },
     body: JSON.stringify(lead), signal: AbortSignal.timeout(10000), redirect: 'error'
    });
    if (!response.ok) throw new Error('UPSTREAM_FAILED');
    return { success: true, leadId: lead.leadId, message: 'Your requirement has been received by our team. We will contact you to discuss suitable options.' };
   });
  } catch (error) {
   if (error instanceof Error && error.message === 'KEY_REUSED') return fail(409, { values, message: 'This enquiry was already sent with different details. Reload the page to start a new request; your shortlist is saved.' });
   return fail(502, { values, message: 'We could not confirm delivery. Your shortlist is saved. Please retry or use the enquiry form or contact our team directly.' });
  }
 }
};
