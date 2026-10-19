<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/Icon.svelte';
</script>

<Seo
	title={page.status + ' | OfNeeds'}
	description="Find corporate gifting products or contact the OfNeeds team."
	noindex
/>
<section class="section error-page">
	<div class="container">
		<p class="eyebrow">{page.status}</p>
		<h1>
			{page.status === 404 ? 'This page took a different route.' : 'We couldn’t load this page.'}
		</h1>
		<p>Explore our gifting range or get in touch with the OfNeeds team.</p>
		<div class="hero-actions">
			<a class="button" href="/">Back to Home <Icon size={18} /></a><a
				class="button button-outline"
				href="/contact">Contact Us</a
			>
		</div>
	</div>
</section>
