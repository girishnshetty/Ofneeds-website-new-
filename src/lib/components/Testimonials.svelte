<script lang="ts">
 import { resolve } from '$app/paths';
 import { testimonials } from '$lib/data/legacy';
 import { customerStories } from '$lib/data/customer-stories';
 let { excludeStoryQuotes = false }: { excludeStoryQuotes?: boolean } = $props();
 const distinct = $derived(testimonials.filter((item, index, all) => all.findIndex((other) => other.quote.trim().toLowerCase() === item.quote.trim().toLowerCase()) === index && (!excludeStoryQuotes || !customerStories.some(story => story.author === item.name))));
</script>
<section class="section testimonials" aria-labelledby="testimonials-heading"><div class="container"><div class="section-heading"><div><p class="eyebrow">Relationships, built over time</p><h2 id="testimonials-heading">Good gifts.<br />Better relationships.</h2></div><p>Distinct feedback retained from the existing site. <a class="text-link" href={resolve("/clients")}>Meet our clients →</a></p></div><div class="review-grid">{#each distinct as testimonial (testimonial.name)}<figure><span class="quote-mark" aria-hidden="true">“</span><blockquote>{testimonial.quote}</blockquote><figcaption><span class="avatar" aria-hidden="true">{testimonial.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><strong>{testimonial.name}</strong><span>{testimonial.role}</span></div></figcaption></figure>{/each}</div></div></section>
