<script lang="ts">
	import { resolve } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import GiftBrandEnquiry from '$lib/components/GiftBrandEnquiry.svelte';
	import { giftMoney } from '$lib/gift-cards';
	import { site } from '$lib/data/site';
	import type { PageProps } from './$types';
	import './brand.css';
	let { data }: PageProps = $props();
	const brand = $derived(data.brand);
	const seo = $derived(data.seo);
	let failedLogo = $state('');
	const trail = $derived([{ name: 'Home', path: '/' }, { name: 'Gift Cards', path: '/gift-cards' }, { name: brand.label, path: brand.href }]);
	const brandSchema = $derived({ '@type': 'Brand', '@id': site.origin + brand.href + '#brand', name: brand.label, ...(brand.logo ? { logo: site.origin + brand.logo.src } : {}) });
</script>

<Seo title={seo.title} description={seo.description} {trail} extra={[brandSchema]} />
<section class="gb-hero"><div class="container"><nav class="gb-breadcrumbs" aria-label="Breadcrumb"><a href={resolve('/')}>Home</a><span>/</span><a href={resolve('/gift-cards')}>Gift Cards</a><span>/</span><span>{brand.label}</span></nav><div class="gb-hero-grid"><div><p class="eyebrow">OFNEEDS · CORPORATE GIFT CARDS · INDIA</p><h1>{brand.label} gift cards<br /><em>for your people.</em></h1><p class="gb-intro">Plan {brand.label} gift cards and gift vouchers with OfNeeds. Compare listed INR values and prepare a bulk enquiry for employee rewards, festive programmes or client appreciation.</p><a class="button" href="#brand-enquiry">Plan your {brand.label} enquiry <Icon size={17} /></a></div><div class="gb-logo" class:gb-logo-dark={brand.logo?.dark}>{#if brand.logo && failedLogo !== brand.slug}<img src={brand.logo.src} alt={brand.name + ' logo'} width={brand.logo.width} height={brand.logo.height} onerror={() => failedLogo = brand.slug} />{:else}<strong>{brand.label}</strong>{/if}<span>{brand.category} · India · INR</span></div></div></div></section>

<section class="section"><div class="container gb-details-grid"><div class="gb-copy"><p class="eyebrow">A CLEARER BRIEF STARTS WITH THE DETAILS</p><h2>{brand.label} gift vouchers,<br />planned around your team.</h2><p>The {brand.name} catalogue includes {brand.values.length === 1 ? 'a listed face value of' : 'listed face values from'} <strong>{giftMoney(brand.values[0])}{brand.values.length > 1 ? ' to ' + giftMoney(brand.values.at(-1)!) : ''}</strong>. Compare the amounts below before choosing your quantity. These are requested voucher face values, with the order quotation confirmed separately.</p><h3>Listed INR values</h3><ul class="gb-values">{#each brand.values as amount (amount)}<li>{giftMoney(amount)}</li>{/each}</ul><dl class="gb-facts"><div><dt>Catalogue name</dt><dd>{brand.name}</dd></div><div><dt>Browsing category</dt><dd>{brand.category}</dd></div><div><dt>Coverage</dt><dd>India · enquiries through OfNeeds, Bengaluru</dd></div></dl><h3>Before placing an order</h3><ul class="gb-confirm"><li>Confirm that the chosen {brand.label} option and denomination can be sourced.</li><li>Check validity, redemption restrictions and the intended recipient experience.</li><li>Agree the complete quotation, including fees, taxes and delivery arrangements.</li></ul><p class="gb-fineprint">Brand names identify the requested gift-card option. Catalogue inclusion does not confirm stock, an authorised reseller relationship, discounts or instant delivery.</p><a class="text-link" href={resolve('/gift-cards')}>Compare all gift-card options <Icon size={15} /></a></div>{#key brand.slug}<GiftBrandEnquiry {brand} />{/key}</div></section>

<section class="section gb-faq"><div class="container"><div><p class="eyebrow">HELP WITH YOUR {brand.label.toUpperCase()} REQUIREMENT</p><h2>{brand.label} gift-card questions.</h2></div><div>{#each seo.faqs as faq (faq.question)}<details><summary>{faq.question}</summary><p>{faq.answer}</p></details>{/each}</div></div></section>

<section class="section gb-related"><div class="container"><p class="eyebrow">MORE OPTIONS TO CONSIDER</p><h2>Explore related gift cards.</h2><div class="gb-related-grid">{#each data.related as other (other.slug)}<a href={resolve(other.href as `/gift-cards/${string}`)}><strong>{other.label}</strong><span>{other.category} <Icon size={15} /></span></a>{/each}</div><a class="text-link" href={resolve('/gift-cards#gift-card-brands')}>Browse every listed gift-card brand <Icon size={15} /></a></div></section>
