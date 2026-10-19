<script lang="ts">
 import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Seo from '$lib/components/Seo.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import { productSelections, budgetRanges, matchesBudget } from '$lib/data/products';
	let search = $state('');
	const category = $derived(page.url.searchParams.get('category') || 'All');
	const budget = $derived(page.url.searchParams.get('budget') || '');
	const groups = [...new Set(productSelections.map((product) => product.category))];
	const filtered = $derived(productSelections.filter((product) => (category === 'All' || product.category === category) && matchesBudget(product, budget) && `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search.trim().toLowerCase())));
	function filter(name: string, value: string) { const url = new URL(page.url); value && value !== 'All' ? url.searchParams.set(name, value) : url.searchParams.delete(name); goto(resolve((url.pathname + url.search) as `/${string}`), { noScroll: true, keepFocus: true }); }
</script>
<Seo title="Explore Corporate Gifts & Welcome Kits | OfNeeds" description="Explore corporate apparel, drinkware, notebooks, bags and welcome-kit packages. Build a multi-product shortlist for a manual corporate quotation." crumb="Products" />
<section class="discovery-intro"><div class="container"><p class="eyebrow">Considered gifts. Clearer choices.</p><h1>Find the right gifts<br />for your people.</h1><p>Explore product types and advertised kit packages. Save your selection, add quantities and send one clear brief to our team.</p><a class="text-link" href={resolve("/contact#quote")}>Review your quote shortlist →</a></div></section>
<section class="section"><div class="container"><div class="discovery-toolbar">
	<label for="product-search">Search products<input id="product-search" type="search" placeholder="Try notebooks or welcome kits" bind:value={search} /></label>
	<label for="product-category">Category<select id="product-category" value={category} onchange={(event) => filter('category', event.currentTarget.value)}><option value="All">All categories</option>{#each groups as group (group)}<option>{group}</option>{/each}</select></label>
	<label for="product-budget">Advertised package budget<select id="product-budget" value={budget} onchange={(event) => filter('budget', event.currentTarget.value)}><option value="">All selections</option>{#each budgetRanges as range (range.id)}<option value={range.id}>{range.label}</option>{/each}</select></label>
	</div><p class="fineprint">Budget filters include only packages with advertised prices. Other products need a quotation. There is no live stock or verified MOQ feed.</p>
	<div class="results-heading"><p role="status">{filtered.length} {filtered.length === 1 ? 'selection' : 'selections'}</p><button type="button" class="text-button" onclick={() => { search = ''; goto(resolve('/products'), { noScroll: true }); }}>Clear filters</button></div>
	<h2 class="sr-only">Product selections</h2>{#if filtered.length}<ProductGrid items={filtered} />{:else}<div class="empty-state"><h2>No selections match yet.</h2><p>Try another category, clear your filters, or share your budget for a custom recommendation.</p><button class="button" type="button" onclick={() => { search = ''; goto(resolve('/products'), { noScroll: true }); }}>Show all selections</button><a class="text-link" href={resolve("/contact#quote")}>Request a custom selection →</a></div>{/if}
</div></section>
