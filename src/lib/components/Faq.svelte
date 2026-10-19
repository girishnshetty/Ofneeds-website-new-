<script lang="ts">
 import { resolve } from '$app/paths';
	import { faqs as defaultFaqs } from '$lib/data/site';
	import Icon from './Icon.svelte';
	let { items = defaultFaqs, heading = 'Good Questions. Helpful Answers.' }: {
		items?: { question: string; answer: string }[]; heading?: string;
	} = $props();
</script>

<section id="faq" class="section faq-section">
	<div class="container faq-layout">
		<div>
			<p class="eyebrow">A little clarity, before you begin</p>
			<h2>{heading}</h2>
			<p>Planning a corporate order? Here’s where to start.</p>
			<a class="text-link" href={resolve("/contact")}>Ask our team <Icon size={17} /></a>
		</div>
		<div class="faq-list">
			{#each items as faq (faq.question)}<details>
					<summary>{faq.question}<Icon name="chevron" size={18} /></summary>
					<p>{faq.answer}</p>
				</details>{/each}
		</div>
	</div>
</section>
