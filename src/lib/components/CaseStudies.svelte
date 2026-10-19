<script lang="ts">
	import { caseStudies } from '$lib/data/editorial';
	const published = caseStudies.filter((project) => project.published);
</script>

{#if published.length}<section class="section">
		<div class="container">
			<p class="eyebrow">From brief to delivery</p>
			<h2>Corporate Gifting Projects</h2>
			<div class="project-grid">
				{#each published as project (project.slug)}<article>
						{#each project.images as image (image.src)}<img
								src={image.src}
								alt={image.alt}
								width="640"
								height="480"
								loading="lazy"
							/>{/each}
						<h3>{project.client}</h3>
						<p>{project.requirement}</p>
						<dl>
							<dt>Products</dt>
							<dd>{project.products.join(', ')}</dd>
							<dt>Quantity</dt>
							<dd>{project.quantity}</dd>
							<dt>Branding</dt>
							<dd>{project.branding}</dd>
							<dt>Timeline</dt>
							<dd>{project.timeline}</dd>
							<dt>Delivery</dt>
							<dd>{project.deliveryLocation}</dd>
						</dl>
						<p>{project.outcome}</p>
					</article>{/each}
			</div>
		</div>
	</section>{/if}
