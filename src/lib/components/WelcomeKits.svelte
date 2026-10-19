<script lang="ts">
	import { welcomeKits } from '$lib/data/legacy';
	import { photography } from '$lib/data/photography';
	import Icon from './Icon.svelte';
</script>

<section id="pricing" class="section kit-section">
	<div class="container kit-layout">
		<div class="kit-intro">
			<p class="eyebrow">A great first impression</p>
			<h2>Employee<br /> Welcome Kits</h2>
			<p>Custom onboarding kits designed around your budget, brand and employee experience.</p>
			<a class="text-link" href="/employee-welcome-kits-bangalore"
				>Explore welcome kits <Icon size={18} /></a
			>
			<figure class="kit-photo">
				<img
					src={photography.welcome.src}
					srcset={photography.welcome.srcset}
					sizes="(max-width: 1100px) calc(100vw - 64px), 360px"
					width={photography.welcome.width}
					height={photography.welcome.height}
					alt={photography.welcome.alt}
					loading="lazy"
					decoding="async"
				/>
				<figcaption class="image-note">
					Presentation inspiration. Package inclusions are listed alongside.
				</figcaption>
			</figure>
		</div>
		<div>
			<div class="kit-cards">
				{#each welcomeKits as kit, i (kit.name)}<article class:featured={i === 1}>
						<p class="eyebrow">{i === 0 ? 'Starter' : 'Essential'} · {kit.name}</p>
						<h3>{kit.price}<span> / kit</span></h3>
						<p>{kit.description}</p>
						<ul>
							{#each kit.inclusions as item (item)}<li>
									<Icon name="check" size={17} />{item}
								</li>{/each}
						</ul>
						<a
							class={i === 1 ? 'button button-white' : 'button button-outline'}
							href="/contact#quote">Customize My Welcome Kit <Icon size={16} /></a
						>
					</article>{/each}
			</div>
			<div class="custom-kit">
				<div>
					<h3>Premium &amp; Build Your Own Kit</h3>
					<p>A tailored product mix, branding and packaging. Priced to your brief.</p>
				</div>
				<a class="text-link" href="/custom-gift-sets">Talk to our team <Icon size={17} /></a>
			</div>
			<p class="fineprint">
				Existing package prices shown. Confirm product specifications, branding, taxes, packaging
				and delivery in your order quotation.
			</p>
		</div>
	</div>
</section>
