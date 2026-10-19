<script lang="ts">
 import { resolve } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import PageIntro from '$lib/components/PageIntro.svelte';
	import { pageFor } from '$lib/data/catalog';
	let { data } = $props();
</script>

<Seo
	title={data.article.title + ' | OfNeeds Insights'}
	description={data.article.description}
	crumb={data.article.title}
/><PageIntro
	title={data.article.title}
	description={data.article.description}
	eyebrow="OfNeeds Insights"
/>
<article class="section">
	<div class="container prose article-prose">
		<time datetime={data.article.publishedAt}>{data.article.publishedAt}</time
		>{#each data.article.sections as section (section.heading)}<section>
				<h2>{section.heading}</h2>
				{#each section.paragraphs as paragraph (paragraph)}<p>{paragraph}</p>{/each}
			</section>{/each}
		<h2>Related Gifting Solutions</h2>
		<ul>
			{#each data.article.related as slug (slug)}{@const related = pageFor(slug)}{#if related}<li>
						<a href={resolve(('/' + slug) as `/${string}`)}>{related.h1}</a>
					</li>{/if}{/each}
		</ul>
		<a class="button" href={resolve("/contact#quote")}>Discuss Your Requirement</a>
	</div>
</article>
