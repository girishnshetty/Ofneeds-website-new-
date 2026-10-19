<script lang="ts">
	import { categories } from '$lib/data/catalog';
	import Icon from './Icon.svelte';
</script>

<div class="category-grid">
	{#each categories as category (category.href)}<a class="category-card" href={category.href}
			><div class="category-image">
				<img
					src={category.image}
					alt={category.imageAlt}
					srcset={category.photo.srcset}
					sizes="(max-width: 768px) calc((100vw - 55px) / 2), (max-width: 1100px) calc((100vw - 84px) / 3), 320px"
					width={category.photo.width}
					height={category.photo.height}
					style:object-position={category.photo.position}
					style:object-fit={category.photo.fit}
					loading="lazy"
					decoding="async"
				/>
			</div>
			<div class="category-copy">
				<h3>{category.title}</h3>
				<p>{category.description}</p>
				<span class="text-link">Explore <Icon size={17} /></span>
			</div></a
		>{/each}
</div>
<p class="image-note">
	Illustrative gifting selections. Products, specifications and branding are confirmed in your
	quote.
</p>
