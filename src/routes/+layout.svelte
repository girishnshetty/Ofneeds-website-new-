<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import WhatsApp from '$lib/components/WhatsApp.svelte';
	let { children, data } = $props();
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
