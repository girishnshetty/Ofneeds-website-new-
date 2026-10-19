<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import PageIntro from '$lib/components/PageIntro.svelte';
	import QuoteForm from '$lib/components/QuoteForm.svelte';
	let { data, form } = $props();
</script>

<Seo
	title="Contact OfNeeds | Get a Corporate Gifting Quote"
	description="Talk to OfNeeds in Bengaluru about corporate gifts, employee welcome kits and branded merchandise. Share your products, quantity, budget and delivery date."
	crumb="Contact"
/>
<PageIntro
	title="Let’s Make Your Next Gift Count."
	description="A team milestone, a new joining day or a company-wide celebration. Tell us about your requirement and we’ll help you plan the right selection."
	eyebrow="Contact OfNeeds"
/>
<QuoteForm enabled={data.quoteEnabled} initial={form} />
