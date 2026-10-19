<script lang="ts">
	import type { Product } from '$lib/data/catalog';
	import Icon from './Icon.svelte';
	let { items }: { items: Product[] } = $props();
</script>

<div class="product-grid">
	{#each items as product (product.name)}<a class="product-card" href={product.href}
			><div class="product-image">
				<img
					src={product.image}
					alt={product.photo.alt}
					srcset={product.photo.srcset}
					sizes="(max-width: 768px) calc((100vw - 55px) / 2), (max-width: 1100px) calc((100vw - 84px) / 3), 320px"
					width={product.photo.width}
					height={product.photo.height}
					style:object-position={product.photo.position}
					style:object-fit={product.photo.fit}
					loading="lazy"
					decoding="async"
				/>
			</div>
			<div class="product-card-copy">
				<h3>{product.name}</h3>
				<p>{product.description}</p>
				<span class="text-link">Request pricing <Icon size={16} /></span>
			</div></a
		>{/each}
</div>
<p class="image-note">
	Illustrative product photography. Ask our team to confirm the available models and customization.
</p>
