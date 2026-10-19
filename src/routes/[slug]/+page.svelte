<script lang="ts">
 import { resolve } from '$app/paths';
	import CatalogueSection from '$lib/components/CatalogueSection.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Faq from '$lib/components/Faq.svelte';
	import { seoFor } from '$lib/data/seo-pages';
	import PageIntro from '$lib/components/PageIntro.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import Clients from '$lib/components/Clients.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Brands from '$lib/components/Brands.svelte';
	import WelcomeKits from '$lib/components/WelcomeKits.svelte';
	import { products, pageFor } from '$lib/data/catalog';
	import { site } from '$lib/data/site';
	import InsightsList from '$lib/components/InsightsList.svelte';
	let { data } = $props();
	const landing = $derived(data.landing);
	const content = $derived(data.content);
</script>

{#if landing}
	<Seo title={landing.title} description={landing.description} crumb={landing.h1} image={landing.photo} /><PageIntro
		title={landing.h1}
		description={landing.intro}
		eyebrow={landing.eyebrow}
		image={landing.image}
		imageAlt={landing.imageAlt}
		photo={landing.photo}
	/>
	<section class="section">
		<div class="container landing-details">
			<div class="prose">
				{#each landing.sections as section (section.title)}<section>
						<h2>{section.title}</h2>
						<p>{section.text}</p>
					</section>{/each}
			</div>
			<aside class="brief-card">
				<p class="eyebrow">For a useful quotation</p>
				<h2>Bring these details<br /> to your brief.</h2>
				<ul>
					{#each landing.checklist as item (item)}<li>
							<Icon name="check" size={18} />{item}
						</li>{/each}
				</ul>
				<a class="button" href={resolve("/contact#quote")}>Request Pricing <Icon size={18} /></a>
			</aside>
		</div>
	</section>
	{#if landing.slug === 'employee-welcome-kits-bangalore'}<WelcomeKits />{/if}
	{#if landing.productNames.length}
	<section class="section section-muted">
		<div class="container">
			<p class="eyebrow">Explore your product mix</p>
			<h2>Relevant Products</h2>
			<ProductGrid
				items={products.filter((product) => landing?.productNames.includes(product.name))}
			/>
		</div>
	</section>
	{/if}
	<section class="section">
		<div class="container">
			<p class="eyebrow">Complete the requirement</p>
			<h2>Related Gifting Solutions</h2>
			<div class="related-grid">
				{#each landing.related as slug (slug)}{@const related = pageFor(slug)}{#if related}<a
							href={resolve(('/' + slug) as `/${string}`)}
							><h3>{related.h1}</h3>
							<Icon size={22} /></a
						>{/if}{/each}
			</div>
		</div>
	</section>
<CatalogueSection slug={landing.slug} />
{#if seoFor('/' + landing.slug)?.faqs}<Faq items={seoFor('/' + landing.slug)?.faqs} heading={landing.h1 + ' FAQs'} />{/if}
{:else if content}
	<Seo
		title={content.title}
		description={content.description}
		crumb={data.slug === 'about' ? 'About Us' : content.h1}
	/><PageIntro
		title={content.h1}
		description={content.description}
		eyebrow={data.slug === 'about' ? 'OfNeeds · Established in 2020' : 'OfNeeds'}
	/>
	{#if data.slug === 'about'}<section class="section">
			<div class="container landing-details">
				<div class="prose">
					<h2>A gifting partner for modern organizations</h2>
					<p>
						OfNeeds is a B2B corporate gifting company based in Bengaluru, established in 2020. We
						support corporate buyers with employee welcome kits, branded apparel, drinkware,
						stationery, bags, awards and customized merchandise.
					</p>
					<h2>From product selection to fulfilment</h2>
					<p>
						Our work brings product sourcing, customization, branding and packaging into one
						coordinated order. Share the occasion, budget and quantities; our team helps you
						consider a product mix and confirm the details for approval.
					</p>
					<h2>Built around your requirements</h2>
					<p>
						We work with HR, procurement, admin, People Operations, marketing teams and founders.
						Corporate orders can be planned for Bengaluru teams and delivery across India, with
						arrangements confirmed for your locations and dates.
					</p>
				</div>
				<aside class="brief-card">
					<p class="eyebrow">The OfNeeds approach</p>
					<h2>Useful products.<br /> Considered branding.</h2>
					<p>
						One partner for multiple gifting categories, with support through product selection,
						customization and order coordination.
					</p>
					<a class="button" href={resolve("/contact#quote")}>Talk to Our Team <Icon size={18} /></a>
				</aside>
			</div>
		</section>
	{:else if data.slug === 'clients'}<Clients /><Testimonials />
	{:else if data.slug === 'brands'}<Brands />
		<section class="section">
			<div class="container prose">
				<h2>Have a particular brand in mind?</h2>
				<p>
					Share the brand name, model, quantity and budget. Our team will confirm product
					availability and sourcing options for your enquiry.
				</p>
				<p>
					For a useful comparison, include any required features, packaging and delivery locations.
					Our team can then discuss the available sourcing options with your quotation.
				</p>
				<a class="button" href={resolve("/contact#quote")}>Discuss Branded Products <Icon size={18} /></a>
			</div>
		</section>
	{:else if data.slug === 'insights'}<InsightsList />
	{:else if data.slug === 'privacy-policy'}<section class="section">
			<div class="container prose">
				<h2>Your enquiry information</h2>
				<p>
					When you request a quotation, you may provide your name, company, work email, phone
					number, products, quantities, budget, delivery details and additional requirements. This
					information helps OfNeeds respond to your enquiry and discuss an order.
				</p>
				<h2>Enquiry channels</h2>
				<p>
					The existing enquiry form is hosted by Tally. Opening or submitting that form involves
					Tally’s service and privacy terms. The brief builder prepares information in your browser;
					choosing the WhatsApp link opens WhatsApp with your prepared requirement. A direct
					submission, when enabled, sends the brief to the OfNeeds configured lead service.
				</p>
				<h2>Your saved product shortlist</h2><p>Product selections and approximate quantities are stored in session storage in your browser tab. They remain until you clear the shortlist or the browser ends the session. Contact details entered in the brief form are not saved to that browser storage. Preparing a WhatsApp message does not send it; you choose whether to open and send it.</p><h2>Website measurement</h2><p>This version does not install an analytics provider. It exposes limited interaction events without names, phone numbers, email addresses or message content. Any future external measurement should use the business-approved provider and consent arrangements.</p><h2>Questions about your information</h2>
				<p>
					Contact <a href={'mailto:' + site.email}>{site.email}</a> for questions about enquiry data or
					to request the complete applicable privacy policy. Avoid including passwords, payment information
					or unrelated sensitive details in an enquiry.
				</p>
			</div>
		</section>
	{:else if data.slug === 'terms-and-conditions'}<section class="section">
			<div class="container prose">
				<h2>Review your written quotation</h2>
				<p>
					Product availability, specifications, quantities, customization, packaging, taxes,
					delivery and the production schedule are confirmed for each order. Displayed package
					prices are existing package information; request a complete quotation for your
					requirement.
				</p>
				<h2>Confirm before production</h2>
				<p>
					Review logo artwork, recipient details, garment sizes and the delivery plan with our team
					before approval. Payment, cancellation, replacement and other applicable order terms must
					be confirmed in the written quotation or agreement.
				</p>
				<h2>Request the applicable terms</h2>
				<p>
					Contact <a href={'mailto:' + site.email}>{site.email}</a> for the complete terms applicable
					to your order before you accept it. This information page does not replace that written agreement.
				</p>
			</div>
		</section>{/if}
{/if}
<section class="closing-cta">
	<div class="container">
		<div>
			<p class="eyebrow">Let’s find the right fit</p>
			<h2>Tell us what you have in mind.</h2>
		</div>
		<a class="button" href={resolve("/contact#quote")}>Get Corporate Quote <Icon size={18} /></a>
	</div>
</section>
