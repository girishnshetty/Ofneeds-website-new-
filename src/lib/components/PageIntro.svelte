<script lang="ts">
 import { resolve } from '$app/paths';
	import type { Photography } from '$lib/data/photography';
	let {
		title,
		description,
		eyebrow = 'OfNeeds',
		image,
		imageAlt,
		photo
	}: {
		title: string;
		description: string;
		eyebrow?: string;
		image?: string;
		imageAlt?: string;
		photo?: Photography;
	} = $props();
	import Icon from './Icon.svelte';
</script>

<section class="page-intro">
	<div class="container">
		<nav class="breadcrumbs" aria-label="Breadcrumb">
			<a href={resolve("/")}>Home</a><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
		</nav>
		<div class:has-image={Boolean(image)} class="page-intro-grid">
			<div>
				<p class="eyebrow" class:brand-eyebrow={eyebrow.includes('OfNeeds')}>{eyebrow}</p>
				<h1>{title}</h1>
				<p class="lead">{description}</p>
				<a class="button" href={resolve("/contact#quote")}>Get Corporate Quote <Icon size={18} /></a>
			</div>
			{#if image}<div class="page-intro-image" class:photographic={Boolean(photo)}>
					<img
						src={image}
						alt={imageAlt ?? title}
						srcset={photo?.srcset}
						sizes="(max-width: 1100px) calc(100vw - 64px), 580px"
						width={photo?.width ?? 800}
						height={photo?.height ?? 800}
						style:object-position={photo?.position}
						style:object-fit={photo?.fit}
						fetchpriority="high"
					/>
				</div>{/if}
		</div>
	</div>
</section>
