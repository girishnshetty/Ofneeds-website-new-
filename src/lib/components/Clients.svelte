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
<section class="client-section" aria-labelledby="clients-heading"><div class="container"><div class="client-heading"><h2 id="clients-heading">Trusted by Teams Across Industries</h2></div><div class="client-logo-grid">{#each clients as logo (logo.src)}<img src={logo.src} alt={logo.alt} width="160" height="64" loading="lazy" decoding="async" />{/each}</div></div></section>
