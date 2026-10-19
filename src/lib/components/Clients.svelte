<script lang="ts">
	import { logos } from '$lib/data/legacy';
	// Original logo assets are retained. Descriptive labels corrected after the asset audit.
	const clients = logos.map((logo) => ({
		...logo,
		src:
			'/optimized/' +
			logo.src
				.split('/')
				.pop()
				?.replace(/\.(png|jpg|webp)$/, '.webp'),
		alt:
			logo.alt === 'Source logo'
				? 'Socure logo'
				: logo.alt === 'Client logo'
					? 'Wheels Box logo'
					: logo.alt
	}));
</script>

<section class="client-section" aria-labelledby="clients-heading">
	<div class="container">
		<div class="client-heading">
			<h2 id="clients-heading">Trusted by Teams Across Industries</h2>
		</div>
		<div class="logo-strip">
			<div id="client-logo-track" class="logo-track">
				{#each [0, 1] as copy (copy)}
					<div class="logo-group" aria-hidden={copy === 1 ? true : undefined}>
						{#each clients as logo (logo.src)}
							<img
								src={logo.src}
								alt={copy === 0 ? logo.alt : ''}
								width="160"
								height="64"
								loading="lazy"
								decoding="async"
							/>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
