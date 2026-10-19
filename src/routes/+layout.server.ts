import { env } from '$env/dynamic/private';
import { webhookReady } from '$lib/server/leads';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = () => ({
	quoteEnabled: webhookReady(env.LEAD_WEBHOOK_URL),
	googleVerification: env.GOOGLE_SITE_VERIFICATION || ''
});
