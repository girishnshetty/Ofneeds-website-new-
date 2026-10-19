<script lang="ts">
	import { testimonials } from '$lib/data/legacy';
</script>

<section class="section testimonials" aria-labelledby="testimonials-heading">
	<div class="container">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Relationships, built over time</p>
				<h2 id="testimonials-heading">What Our Clients Say</h2>
			</div>
			<div class="testimonial-controls">
				<p>Experiences shared by the teams we’ve worked with.</p>
			</div>
		</div>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard focus enables native horizontal scrolling in this labelled region.) -->
		<div class="testimonial-strip" role="region" tabindex="0"
			aria-label="Client testimonials. Scroll horizontally to read more.">
			<div id="testimonial-track" class="testimonial-track">
				{#each [0, 1] as copy (copy)}
					<div class="testimonial-grid testimonial-group" class:duplicate={copy === 1}
						aria-hidden={copy === 1 ? true : undefined}>
						{#each testimonials as testimonial (testimonial.name)}
							<figure>
								<span class="quote-mark" aria-hidden="true">“</span>
								<blockquote>{testimonial.quote}</blockquote>
								<figcaption>
									<span class="avatar" aria-hidden="true">{testimonial.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
									<div><strong>{testimonial.name}</strong><span>{testimonial.role}</span></div>
								</figcaption>
							</figure>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.testimonial-controls { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; max-width: 360px; }
	.testimonial-controls p { margin: 0; font-size: 13px; }
	.testimonial-strip { --review-width: 340px; max-width: 100%; overflow-x: auto; scrollbar-width: thin; scrollbar-color: #b6c6ce transparent; padding-bottom: 14px; }
	.testimonial-strip:focus-visible { outline: 2px solid var(--blue); outline-offset: 6px; border-radius: 6px; }
	.testimonial-track { display: flex; width: max-content; animation: testimonial-scroll 100s linear infinite; }
	.testimonial-group { display: flex; flex-wrap: nowrap; gap: 20px; width: max-content; padding-right: 20px; }
	.testimonial-group figure { flex: 0 0 var(--review-width); width: var(--review-width); min-width: 0; }
	.testimonial-strip:hover .testimonial-track,
	.testimonial-strip:focus-within .testimonial-track { animation-play-state: paused; }
	@keyframes testimonial-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
	@media (max-width: 768px) {
		.testimonial-strip { --review-width: min(310px, calc(100vw - 72px)); }
		.testimonial-group { gap: 16px; padding-right: 16px; }
	}
	@media (prefers-reduced-motion: reduce) {
		.testimonial-track { animation: none; }
		.testimonial-group.duplicate { display: none; }
	}
</style>
