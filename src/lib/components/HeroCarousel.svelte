<script lang="ts">
	import { onMount } from 'svelte';
	import { heroSlides } from '$lib/data/hero-slides';
	let active = $state(0);
	let reducedMotion = $state(false);
	let visible = $state(true);
	let loaded = $state<boolean[]>(heroSlides.map(() => false));
	let frame = $state<HTMLDivElement>();
	const slide = $derived(heroSlides[active]);
	function select(index: number) {
		active = (index + heroSlides.length) % heroSlides.length;
	}
	onMount(() => {
		frame?.querySelectorAll('img').forEach((image, index) => {
			loaded[index] = image.complete && image.naturalWidth > 0;
		});
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => { reducedMotion = preference.matches; };
		const updateVisibility = () => { visible = !document.hidden; };
		updatePreference();
		updateVisibility();
		preference.addEventListener('change', updatePreference);
		document.addEventListener('visibilitychange', updateVisibility);
		const timer = window.setInterval(() => {
			const next = (active + 1) % heroSlides.length;
			if (!reducedMotion && visible && loaded[next]) active = next;
		}, 3000);
		return () => {
			window.clearInterval(timer);
			preference.removeEventListener('change', updatePreference);
			document.removeEventListener('visibilitychange', updateVisibility);
		};
	});
</script>

<div
	class="hero-carousel"
	role="region"
	aria-roledescription="carousel"
	aria-label="OfNeeds gifting inspiration"
>
	<div class="hero-image-frame carousel-frame" {@attach (element) => { frame = element; return () => { frame = undefined; }; }}>
		<div class="hero-image-stage">
		{#each heroSlides as item, index (item.key)}
			<div
				class="hero-slide"
				class:active={active === index}
				role="group"
				aria-roledescription="slide"
				aria-label={`${index + 1} of ${heroSlides.length}: ${item.title}`}
				aria-hidden={active !== index}
			>
				<img
					src={item.src}
					srcset={item.srcset}
					sizes="(max-width: 760px) 92vw, 45vw"
					alt={item.alt}
					width="1254"
					height="1254"
					fetchpriority={index === 0 ? 'high' : 'low'}
					loading="eager"
					decoding="async"
					onload={() => { loaded[index] = true; }}
				/>
			</div>
		{/each}
		</div>
		<div class="hero-carousel-caption" aria-live="off">
			<p class="hero-slide-eyebrow">Gifting, thoughtfully imagined</p>
			<strong>{slide.title}</strong>
			<span>{slide.caption}</span>
		</div>
	</div>
	<div class="hero-carousel-controls">
		<button class="carousel-arrow" type="button" aria-label="Previous gifting image" onclick={() => select(active - 1)}>←</button>
		<div class="hero-carousel-dots" aria-label="Choose a gifting image">
			{#each heroSlides as item, index (item.key)}
				<button
					type="button"
					class:active={active === index}
					aria-label={`Show image ${index + 1}: ${item.title}`}
					aria-pressed={active === index}
					onclick={() => select(index)}
				><span></span></button>
			{/each}
		</div>
		<button class="carousel-arrow" type="button" aria-label="Next gifting image" onclick={() => select(active + 1)}>→</button>
	</div>
	<p class="hero-carousel-note">Gifting concepts. Final products and branding tailored to your brief.</p>
</div>
