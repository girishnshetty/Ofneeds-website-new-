<script lang="ts">
 import { resolve } from '$app/paths';
	import type { Product } from '$lib/data/catalog';
	import { quote } from '$lib/quote';
	import Icon from './Icon.svelte';
	let { product }: { product: Product } = $props();
	const selected = $derived($quote.some((item) => item.id === product.id));
	let feedback = $state('');
</script>
<article class="selection-card">
	<a class="selection-image" href={resolve((product.href) as `/${string}`)} aria-label={'View ' + product.name + ' — ' + (product.kind === 'package' ? 'Welcome-kit package' : 'Product selection')}>
		<img src={product.image} srcset={product.photo.srcset} sizes="(max-width: 600px) 90vw, (max-width: 1000px) 44vw, 28vw" width={product.photo.width} height={product.photo.height} alt={product.photo.alt} loading="lazy" decoding="async" style:object-fit={product.photo.fit} style:object-position={product.photo.position} />
		<span class="selection-badge">{product.kind === 'package' ? 'Welcome-kit package' : 'Product selection'}</span>
	</a>
	<div class="selection-copy"><p class="eyebrow">{product.category}</p><h3><a href={resolve((product.href) as `/${string}`)}>{product.name}</a></h3><p>{product.description}</p><strong class="selection-price">{product.priceVerified && product.price !== null ? `₹${product.price.toLocaleString('en-IN')} / kit` : 'Contact for Pricing'}</strong><p class="fineprint">{product.priceVerified ? 'Branding, GST & delivery confirmed in quote.' : 'Models, MOQ & availability confirmed in quote.'}</p>
		<div class="selection-actions"><a class="text-link" href={resolve((product.href) as `/${string}`)}>View details <Icon size={16} /></a><button type="button" class="button button-small" onclick={() => { quote.add(product.id, $quote.find((item) => item.id === product.id)?.quantity ?? 1); feedback = `${product.name} is in your quote shortlist.`; }}>{selected ? 'In your quote' : 'Add to Quote'}<Icon size={15} /></button></div><span class="sr-only" role="status">{feedback}</span>
	</div>
</article>
