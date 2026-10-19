<script lang="ts">
	import type { Product } from '$lib/data/catalog';
	import ProductCard from './ProductCard.svelte';
	let { items }: { items: Product[] } = $props();
</script>

<div class="selection-grid">{#each items as product (product.id)}<ProductCard {product} />{/each}</div>
<p class="image-note">
	Product imagery is illustrative or from the supplied catalogues. Exact models, specifications and branding are confirmed in your quotation.
</p>
