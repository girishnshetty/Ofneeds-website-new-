<script lang="ts">
	import { resolve } from '$app/paths';
	import { caseStudies } from '$lib/data/editorial';
	import { customerStories } from '$lib/data/customer-stories';
	const published = caseStudies.filter((project) => project.published);
</script>

{#if customerStories.length}<section id="customer-stories" class="section customer-stories" aria-labelledby="stories-heading"><div class="container"><div class="section-heading"><div><p class="eyebrow">The experience, in their words</p><h2 id="stories-heading">Gifts that become<br />good relationships.</h2></div><p>Customer stories drawn from feedback already published on our website. Details below reflect what each customer shared.</p></div><div class="story-grid">{#each customerStories as story, index (story.slug)}<article><div class="story-header"><span class="story-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{story.client}</p></div><h3>{story.title}</h3><p class="story-description">{story.summary}</p><dl><div><dt>Products mentioned</dt><dd>{story.products.join(', ')}</dd></div>{#if story.quantity}<div><dt>Quantity mentioned</dt><dd>{story.quantity}</dd></div>{/if}</dl><figure><blockquote>“{story.quote}”</blockquote><figcaption><strong>{story.author}</strong><span>{story.role}</span></figcaption></figure><p class="story-source">Source: existing customer testimonial</p><a class="text-link" href={resolve((story.categoryHref) as `/${string}`)}>Explore this gifting category →</a></article>{/each}</div></div></section>{/if}

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
						{#if project.projectType}<p class="eyebrow">{project.projectType}</p>{/if}
						<p>{project.requirement}</p>
						<dl>
							<dt>Products</dt>
							<dd>{project.products.join(', ')}</dd>
							{#if project.quantity}<dt>Quantity</dt>
							<dd>{project.quantity}</dd>{/if}
							{#if project.branding}<dt>Branding</dt>
							<dd>{project.branding}</dd>{/if}
							{#if project.timeline}<dt>Timeline</dt>
							<dd>{project.timeline}</dd>{/if}
							{#if project.deliveryLocation}<dt>Delivery</dt>
							<dd>{project.deliveryLocation}</dd>{/if}
						</dl>
						{#if project.outcome}<p>{project.outcome}</p>{/if}
					</article>{/each}
			</div>
		</div>
	</section>{/if}
