<script lang="ts">
	import './layout.css';
	import './improvements.css';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { quote } from '$lib/quote';
	import { track } from '$lib/analytics';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import WhatsApp from '$lib/components/WhatsApp.svelte';
	let { children, data } = $props();
	onMount(() => {
		quote.load();
		const listener = (event: MouseEvent) => {
			const anchor = (event.target as Element)?.closest?.('a');
			if (!anchor) return;
			const href = anchor.getAttribute('href') || '';
			if (href.startsWith('https://wa.me/')) track('WhatsApp Clicked');
			else if (href.startsWith('tel:')) track('Phone Clicked');
			else if (href.startsWith('mailto:')) track('Email Clicked');
			else if (anchor.dataset.catalogueId) track('Catalogue Downloaded', { catalogue_id: anchor.dataset.catalogueId });
		};
		document.addEventListener('click', listener);
		return () => document.removeEventListener('click', listener);
	});
	afterNavigate(({ to }) => { if (to?.url.pathname === '/products') track('Category Viewed', { category_id: 'products' }); });
</script>

<svelte:head
	><link rel="icon" href={favicon} />{#if data.googleVerification}<meta
			name="google-site-verification"
			content={data.googleVerification}
		/>{/if}<meta name="theme-color" content="#10283f" /></svelte:head
>
<a class="skip-link" href="#main-content">Skip to content</a><Header />
<main id="main-content" tabindex="-1">{@render children()}</main>
<Footer /><WhatsApp />
