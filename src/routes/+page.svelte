<script lang="ts">
 import { resolve } from '$app/paths';
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
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import { productSelections, budgetRanges } from '$lib/data/products';

	import {
		homeTitle,
		homeDescription,
		benefits,
		steps,
		serviceAreas,
		whatsappUrl,
	} from '$lib/data/site';
	let { data } = $props();
</script>

<Seo title={homeTitle} description={homeDescription} />
<section id="home" class="hero">
	<div class="container enterprise-hero-grid">
		<div class="hero-copy">
			<p class="eyebrow">OfNeeds · Corporate gifting &amp; merchandise</p>
			<h1>Corporate Gifting<br /><span>Made Simple.</span></h1>
			<p class="hero-description">
				Premium employee welcome kits, customized corporate gifts and branded merchandise for businesses across Bangalore and India.
			</p>
			<div class="hero-actions">
				<a class="button" href="#contact">Get Corporate Quote <Icon size={18} /></a><a
					class="button button-outline"
					href={resolve("/products")}>Explore Products <Icon size={18} /></a
				>
			</div>
			<a class="hero-whatsapp" href={whatsappUrl()} target="_blank" rel="external noopener noreferrer"
				>Or start a conversation on WhatsApp <Icon size={15} /></a
			>
			<p class="hero-trust">
				Bengaluru Based <span>•</span> Custom Branding <span>•</span> Bulk Orders
			</p>
		</div>
		<figure class="enterprise-hero-visual"><img src="/hero-carousel/branded-signature-800.webp" srcset="/hero-carousel/branded-signature-480.webp 480w, /hero-carousel/branded-signature-800.webp 800w, /hero-carousel/branded-signature-1254.webp 1254w" sizes="(max-width: 760px) 90vw, 44vw" width="1254" height="1254" alt="Illustrative navy gift box, notebook, pen and mug with coordinated custom branding" fetchpriority="high" /><figcaption><span>Thoughtful products. Your brand.</span><small>Illustrative concept · tailored to your brief</small></figcaption></figure>
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
		<a class="button button-outline" href={resolve("/catalogues")} style="margin-top: 28px">Browse &amp; Download Catalogues <Icon size={18} /></a>
	</div>
</section>
<section class="section section-muted"><div class="container"><div class="section-heading"><div><p class="eyebrow">A useful place to start</p><h2>Everyday essentials.<br />Lasting impressions.</h2></div><a class="text-link" href={resolve("/products")}>Explore all selections <Icon size={18} /></a></div><ProductGrid items={[productSelections[0], productSelections[4], productSelections[1]]} /></div></section>
<WelcomeKits />
<section class="section budget-section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Plan with a clear budget</p><h2>Thoughtful at every scale.</h2></div><p>Start with a per-person budget. We’ll confirm the right products and complete costs in your quote.</p></div><div class="budget-grid">{#each budgetRanges as range (range.id)}<a href={resolve(('/products?budget=' + range.id) as `/${string}`)}><span>Per recipient</span><h3>{range.label}</h3><span class="text-link">Explore options <Icon size={16} /></span></a>{/each}</div><p class="fineprint">Only advertised package prices appear in budget results. For a wider selection, <a href={resolve("/contact#quote")}>request options within your budget</a>.</p></div></section>
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
			<a class="button button-white" href={resolve("/contact#quote")}
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
<CaseStudies /><Brands compact /><GiftingSolutions /><Testimonials excludeStoryQuotes />
<section class="section local-section">
	<div class="container local-layout">
		<div>
			<p class="eyebrow">Rooted in Bengaluru. Reaching across India.</p>
			<h2>Corporate Gifting<br /> Company in Bangalore</h2>
			<a class="text-link" href={resolve("/corporate-gifting-bangalore")}
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

<Faq />
<div id="contact"><QuoteForm enabled={data.quoteEnabled} /></div>
