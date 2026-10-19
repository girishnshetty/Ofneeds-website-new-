<script lang="ts">
 import { resolve } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import PageIntro from '$lib/components/PageIntro.svelte';
	let { data } = $props();
</script>

<Seo
	title={data.brand.name + ' Corporate Orders | OfNeeds'}
	description={data.brand.description}
	crumb={data.brand.name}
/><PageIntro
	title={data.brand.name + ' for Corporate Orders'}
	description={data.brand.description}
/>
<section class="section">
	<div class="container prose">
		<h2>Discuss Your Product Requirement</h2>
		<ul>
			{#each data.brand.products as product (product)}<li>{product}</li>{/each}
		</ul>
		<p>Product models, availability and pricing are confirmed with your quotation.</p>
		<a class="button" href={resolve("/contact#quote")}>Request Pricing</a>
	</div>
</section>
