<script lang="ts">
	import { brands } from '$lib/data/editorial';
	const verified = brands.filter((brand) => brand.verified);
</script>

{#if verified.length}<section class="section">
		<div class="container">
			<p class="eyebrow">Sourced for your requirement</p>
			<h2>Brands Available for Corporate Orders</h2>
			<div class="brand-grid">
				{#each verified as brand (brand.slug)}<a href={'/brands/' + brand.slug}
						>{#if brand.logo}<img
								src={brand.logo}
								alt={brand.name}
								width="160"
								height="80"
								loading="lazy"
							/>{/if}
						<h3>{brand.name}</h3>
						<p>{brand.description}</p></a
					>{/each}
			</div>
		</div>
	</section>{/if}
