<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import GiftingSolutions from '$lib/components/GiftingSolutions.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Clients from '$lib/components/Clients.svelte';
	import CategoryGrid from '$lib/components/CategoryGrid.svelte';
	import WelcomeKits from '$lib/components/WelcomeKits.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import QuoteForm from '$lib/components/QuoteForm.svelte';
	import CaseStudies from '$lib/components/CaseStudies.svelte';
	import Brands from '$lib/components/Brands.svelte';

	import {
		homeTitle,
		homeDescription,
		benefits,
		steps,
		serviceAreas,
		faqs,
		whatsappUrl,
		site
	} from '$lib/data/site';
	import { welcomeKits } from '$lib/data/legacy';
	let { data } = $props();
	const extra = [
		{
			'@type': 'FAQPage',
			mainEntity: faqs.map((faq) => ({
				'@type': 'Question',
				name: faq.question,
				acceptedAnswer: { '@type': 'Answer', text: faq.answer }
			}))
		},
		...welcomeKits.map((kit) => ({
			'@type': 'Product',
			name: 'OfNeeds ' + kit.name + ' Employee Welcome Kit',
			image: site.origin + '/optimized/hero-1066.webp',
			url: site.origin + '/employee-welcome-kits-bangalore',
			description: kit.inclusions.join(', '),
			brand: { '@type': 'Brand', name: 'OfNeeds' },
			offers: {
				'@type': 'Offer',
				price: kit.price.replace('₹', ''),
				priceCurrency: 'INR',
				url: site.origin + '/employee-welcome-kits-bangalore'
			}
		}))
	];
</script>

<Seo title={homeTitle} description={homeDescription} {extra} />
<section id="home" class="hero">
	<div class="container hero-copy-only">
		<div class="hero-copy">
			<p class="hero-tagline">
				Thoughtfully chosen. Beautifully branded.
			</p>
			<h1>One Platform for <span>Branded Merchandise</span></h1>
			<p class="hero-description">
				Create a seamless branded merchandise experience for your team and clients. From curated products and custom branding to easy ordering, competitive pricing, and reliable delivery  everything managed in one place.
			</p>
			<div class="hero-actions">
				<a class="button" href="#contact">Get Corporate Quote <Icon size={18} /></a><a
					class="button button-outline"
					href="#products">Explore Products <Icon size={18} /></a
				>
			</div>
			<a class="hero-whatsapp" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"
				>Or start a conversation on WhatsApp <Icon size={15} /></a
			>
			<p class="hero-trust">
				Bengaluru Based <span>•</span> Custom Branding <span>•</span> Bulk Orders
			</p>
		</div>
	</div>
</section>
<Clients />
<section id="products" class="section">
	<div class="container">
		<div class="section-heading">
			<div>
				<p class="eyebrow">One partner. A world of possibilities.</p>
				<h2>Corporate Gifting for<br /> Every Requirement</h2>
			</div>
			<p>
				From a warm welcome to a well-earned thank you. Find the right products for every business
				moment.
			</p>
		</div>
		<CategoryGrid />
		<a class="button button-outline" href="/catalogues" style="margin-top: 28px">Browse &amp; Download Catalogues <Icon size={18} /></a>
	</div>
</section>
<WelcomeKits />
<section id="why-ofneeds" class="section">
	<div class="container">
		<div class="section-heading">
			<div>
				<p class="eyebrow">The details make the difference</p>
				<h2>Why Companies<br /> Choose OfNeeds</h2>
			</div>
			<p>Products, customization and fulfilment, connected around your business requirement.</p>
		</div>
		<div class="benefit-grid">
			{#each benefits as benefit (benefit.title)}<article>
					<span class="benefit-icon"><Icon name={benefit.icon} size={27} /></span>
					<h3>{benefit.title}</h3>
					<p>{benefit.text}</p>
				</article>{/each}
		</div>
	</div>
</section>
<section class="section process-section">
	<div class="container">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Less coordination. More clarity.</p>
				<h2>Corporate Gifting<br /> Made Simple</h2>
			</div>
			<a class="button button-white" href="/contact#quote"
				>Share Your Requirement <Icon size={18} /></a
			>
		</div>
		<ol class="process-grid">
			{#each steps as step, i (step.title)}<li>
					<span class="step-number">{String(i + 1).padStart(2, '0')}</span>
					<h3>{step.title}</h3>
					<p>{step.text}</p>
				</li>{/each}
		</ol>
	</div>
</section>
<CaseStudies /><Brands /><Testimonials />
<section class="section local-section">
	<div class="container local-layout">
		<div>
			<p class="eyebrow">Rooted in Bengaluru. Reaching across India.</p>
			<h2>Corporate Gifting<br /> Company in Bangalore</h2>
			<a class="text-link" href="/corporate-gifting-bangalore"
				>Gifting for your Bengaluru team <Icon size={18} /></a
			>
		</div>
		<div>
			<p>
				Established in 2020, OfNeeds helps organizations turn gifting requirements into considered
				product selections. We work with HR, procurement, admin, People Operations and marketing
				teams on employee welcome kits, branded apparel, client gifts and event merchandise.
			</p>
			<p>
				Our Bengaluru service coverage includes {serviceAreas.slice(0, -1).join(', ')} and {serviceAreas.at(
					-1
				)}. Whether you’re planning for one office or teams across India, share your budget,
				quantities and locations so we can coordinate the right products, branding, packaging and
				delivery.
			</p>
		</div>
	</div>
</section>
<GiftingSolutions />

<Faq />
<div id="contact"><QuoteForm enabled={data.quoteEnabled} /></div>

<style>
	.hero-copy-only .hero-copy {
		max-width: 760px;
		margin-inline: auto;
		text-align: center;
	}
	.hero-copy-only h1 {
		max-width: 760px;
		margin-inline: auto;
	}
	.hero-copy-only .hero-description {
		max-width: 700px;
		margin-inline: auto;
	}
	.hero-copy-only .hero-actions,
	.hero-copy-only .hero-trust {
		justify-content: center;
	}
</style>
