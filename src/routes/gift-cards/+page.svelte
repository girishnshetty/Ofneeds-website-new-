<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import GiftCardTile from '$lib/components/GiftCardTile.svelte';
	import { seoFor } from '$lib/data/seo-pages';
	import { site } from '$lib/data/site';
	import { giftBrandHref } from '$lib/gift-card-brands';
	import { browseGiftCards, giftCatalogue, giftCatalogueMeta, type GiftSort } from '$lib/gift-card-catalogue';
	import { giftCategories, giftPreferences, giftOccasions, giftMoney, giftStorageKey, restoreGiftBrief, validGiftLine, giftContactHref, giftOptionFor, giftBriefLimit, type GiftLine } from '$lib/gift-cards';
	import './gift-cards.css';
	const giftSeo = seoFor('/gift-cards')!;
	const brandNames = [...new Map(giftCatalogue.map(option => [option.name.toLocaleLowerCase('en-IN'), option.name])).values()].sort((a, b) => a.localeCompare(b, 'en-IN'));
	const brandListSchema = { '@type': 'ItemList', '@id': site.origin + '/gift-cards#brands', name: 'OfNeeds gift-card brand directory', numberOfItems: brandNames.length, itemListElement: brandNames.map((name, index) => ({ '@type': 'ListItem', position: index + 1, name, url: site.origin + giftBrandHref(name) })) };
	let search = $state('');
	let category = $state('All');
	let sort = $state<GiftSort>('az');
	let pageNumber = $state(1);
	let perPage = $state(12);
	let customCategory = $state('shopping');
	let lines = $state<GiftLine[]>([]);
	let occasion = $state('Employee recognition');
	let ready = $state(false);
	let storageNotice = $state('');
	let announcement = $state('');
	const results = $derived(browseGiftCards(search, category, sort));
	const pageCount = $derived(Math.max(1, Math.ceil(results.length / perPage)));
	const currentPage = $derived(Math.min(pageNumber, pageCount));
	const start = $derived((currentPage - 1) * perPage);
	const visible = $derived(results.slice(start, start + perPage));
	const pageNumbers = $derived(Array.from({ length: Math.min(5, pageCount) }, (_, index) => Math.max(1, Math.min(currentPage - 2, pageCount - 4)) + index));
	const valid = $derived(lines.length > 0 && lines.every(validGiftLine));
	const quantity = $derived(valid ? lines.reduce((sum, line) => sum + line.quantity, 0) : 0);
	const total = $derived(valid ? lines.reduce((sum, line) => sum + line.quantity * line.value, 0) : 0);
	const enquiryHref = $derived(valid ? giftContactHref({ lines, occasion }) : '');
	onMount(() => {
		try { const saved = restoreGiftBrief(sessionStorage.getItem(giftStorageKey)); lines = saved.lines; occasion = saved.occasion; }
		catch { storageNotice = 'Browser storage is unavailable. Keep this tab open while preparing your enquiry.'; }
		ready = true;
	});
	$effect(() => {
		if (ready) {
			try { sessionStorage.setItem(giftStorageKey, JSON.stringify({ lines, occasion })); }
			catch { storageNotice = 'Your brief could not be saved in this browser. Continue to the enquiry before closing this page.'; }
		}
	});
	function add(id: string, value = 500, count = 100) {
		if (lines.some(line => line.id === id)) return;
		if (lines.length >= giftBriefLimit) { announcement = 'Your brief has five selections. Remove a selection to add another.'; return; }
		const line = { id, quantity: count, value, brand: '' };
		if (!validGiftLine(line)) return;
		lines = [...lines, line];
		announcement = `${giftOptionFor(id)?.name} added to your brief.`;
	}
	function remove(id: string) { lines = lines.filter(line => line.id !== id); announcement = 'Selection removed from your brief.'; }
	function reset() { search = ''; category = 'All'; sort = 'az'; pageNumber = 1; }
	function changePage(value: number) { pageNumber = value; document.getElementById('gift-options')?.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
</script>

<Seo title={giftSeo.title} description={giftSeo.description} extra={[brandListSchema]} crumb="Gift Cards" />

<section class="gc-hero">
	<div class="container gc-hero-grid">
		<div><p class="eyebrow">OFNEEDS · CORPORATE GIFT CARDS · INDIA</p><h1>Corporate gift cards.<br /><em>Their choice.</em></h1><p class="gc-intro">Explore OfNeeds gift cards and gift vouchers for employee rewards, festive gifting and client appreciation across India.</p><div class="gc-hero-actions"><a class="button" href="#gift-options">Explore gift cards <Icon size={17} /></a><a class="gc-light-link" href="#gift-brief">Build a bulk enquiry ↓</a></div><div class="gc-hero-points"><span>{giftCatalogueMeta.count} gift-card listings</span><span>{giftCatalogueMeta.distinctNames} distinct names</span><span>India · INR</span></div></div>
		<div class="gc-art" aria-label="Illustrative OfNeeds gift card, not a redeemable voucher"><div class="gc-art-back"></div><div class="gc-art-card"><span>OfNeeds <small>GIFTING POSSIBILITIES</small></span><Icon name="tag" size={34} /><strong>A little choice.<br />A lot of thought.</strong><div><span>FOR SOMEONE WHO MATTERS</span><span>INDIA / INR</span></div></div><div class="gc-art-caption">Good work deserves a thoughtful thank-you.</div></div>
	</div>
</section>
<div class="gc-service-strip"><div class="container"><span><Icon name="grid" size={17} /> Find a favourite brand</span><span><Icon name="pen" size={17} /> Choose value & quantity</span><span><Icon name="chat" size={17} /> Request a bulk quotation</span></div></div>

<section class="section gc-catalogue" id="gift-options">
	<div class="container">
		<div class="section-heading"><div><p class="eyebrow">MORE CHOICE. MORE WAYS TO SAY THANK YOU.</p><h2>Find their favourite.</h2></div><p>Browse {giftCatalogueMeta.count} gift-card listings. Choose a brand, value and quantity to add to your corporate gifting brief.</p></div>
		<div class="gc-notice"><Icon name="chat" size={19} /><p><strong>Plan now. Confirm with our team.</strong> Brand options and listed face values are available to enquire about. OfNeeds confirms sourcing, pricing, validity and delivery before an order.</p></div>
		<div class="gc-filters"><label class="gc-search">Search gift cards<input type="search" bind:value={search} oninput={() => pageNumber = 1} placeholder="Search Amazon, Starbucks, travel…" maxlength="100" /></label><label class="gc-country">Country<select aria-label="Country"><option value="IN">India · INR</option></select></label></div>
		<div class="gc-category-tabs" role="group" aria-label="Filter gift-card categories">{#each giftCategories as item (item)}<button type="button" class:chosen={category === item} aria-pressed={category === item} onclick={() => { category = item; pageNumber = 1; }}>{item}</button>{/each}</div>
		<div class="gc-browse-tools"><label>Sort by<select aria-label="Sort gift cards" bind:value={sort} onchange={() => pageNumber = 1}><option value="az">Brand name: A–Z</option><option value="za">Brand name: Z–A</option><option value="low">Lowest starting face value</option><option value="high">Highest starting face value</option></select></label><label>Show<select aria-label="Gift cards per page" bind:value={perPage} onchange={() => pageNumber = 1}><option value={12}>12 per page</option><option value={24}>24 per page</option><option value={48}>48 per page</option></select></label><a href="#gift-brief">Your brief ({lines.length}/{giftBriefLimit}) ↓</a></div>
		<div class="gc-result-heading"><p aria-live="polite">{#if results.length}Showing {start + 1}–{Math.min(start + perPage, results.length)} of {results.length} gift cards{:else}0 matching gift cards{/if}</p>{#if search || category !== 'All' || sort !== 'az'}<button type="button" class="gc-text-button" onclick={reset}>Clear filters</button>{/if}<span>{giftCatalogueMeta.count} total listings</span></div>
		{#if lines.length >= giftBriefLimit}<p class="gc-brief-limit" role="status">Your brief has {giftBriefLimit} gift-card options. <a href="#gift-brief">Review your selections</a> or remove one to choose another.</p>{/if}
		<div class="gc-card-grid">{#each visible as option (option.id)}<GiftCardTile {option} selected={lines.some(line => line.id === option.id)} limitReached={lines.length >= giftBriefLimit} onadd={add} />{/each}</div>
		{#if !results.length}<div class="gc-empty"><h3>No matching gift cards</h3><p>Try another brand name or clear the filters. You can also request another brand below.</p><button class="button button-outline" type="button" onclick={reset}>Show all gift cards</button></div>{/if}
		{#if pageCount > 1}<nav class="gc-pagination" aria-label="Gift-card catalogue pages"><button type="button" aria-label="First catalogue page" disabled={currentPage === 1} onclick={() => changePage(1)}>«</button><button type="button" aria-label="Previous catalogue page" disabled={currentPage === 1} onclick={() => changePage(currentPage - 1)}>‹</button>{#each pageNumbers as number (number)}<button type="button" aria-label={'Catalogue page ' + number} aria-current={number === currentPage ? 'page' : undefined} onclick={() => changePage(number)}>{number}</button>{/each}<button type="button" aria-label="Next catalogue page" disabled={currentPage === pageCount} onclick={() => changePage(currentPage + 1)}>›</button><button type="button" aria-label="Last catalogue page" disabled={currentPage === pageCount} onclick={() => changePage(pageCount)}>»</button><span>Page {currentPage} of {pageCount}</span></nav>{/if}
		<details class="gc-custom-request"><summary>Can’t find the brand you have in mind?</summary><p>Add a custom preference and tell us your preferred brand in the brief.</p><div><label class="gc-field">Gifting category<select aria-label="Custom gifting category" bind:value={customCategory}>{#each giftPreferences as option (option.id)}<option value={option.id}>{option.name}</option>{/each}</select></label><button class="button button-outline" type="button" disabled={lines.length >= giftBriefLimit || lines.some(line => line.id === customCategory)} onclick={() => add(customCategory)}>Add custom preference <Icon size={16} /></button><a href="#gift-brief">Edit your brief ↓</a></div></details>
	</div>
</section>

<section class="section gc-planner" id="gift-brief"><div class="container gc-planner-grid">
	<div class="gc-planner-intro"><p class="eyebrow">FROM A GOOD IDEA TO A CLEAR BRIEF</p><h2>Plan your next<br />“thank you”.</h2><p>Choose up to {giftBriefLimit} gift-card options for one enquiry. Set the quantities and requested face values, then share the details with our team.</p><ol><li><strong>Choose</strong><span>Find a brand your recipients will enjoy.</span></li><li><strong>Plan</strong><span>Set quantities and select listed INR values.</span></li><li><strong>Enquire</strong><span>Share your details and request a quotation.</span></li></ol><p class="gc-small">Your brief stays in this browser tab’s session. No voucher is issued or payment collected here.</p></div>
	<div class="gc-brief-panel"><div class="gc-brief-heading"><h3>Your gift-card brief</h3><span>INDIA · INR</span></div>
		{#if !lines.length}<div class="gc-brief-empty"><Icon name="tag" size={32} /><h4>A little choice starts here.</h4><p>Add a gift card above to build your requirement.</p><a class="button button-outline" href="#gift-options">Explore gift cards ↑</a></div>{:else}
			<label class="gc-field">Gifting occasion<select aria-label="Gifting occasion" bind:value={occasion}>{#each giftOccasions as item (item)}<option>{item}</option>{/each}</select></label>
			{#each lines as line (line.id)}{@const option = giftOptionFor(line.id)!}<div class="gc-brief-line"><div class="gc-line-heading"><h4>{option.name}{#if 'copies' in option && option.copies > 1}<small> · Listing {option.listing} of {option.copies}</small>{/if}</h4><button type="button" class="gc-text-button" aria-label={'Remove ' + option.name} onclick={() => remove(line.id)}>Remove</button></div>{#if !('denominations' in option)}<label class="gc-field">Preferred brand (optional)<input type="text" maxlength="80" bind:value={line.brand} placeholder="Tell us which brand you have in mind" /></label>{/if}<div class="gc-line-fields"><label class="gc-field">Number of vouchers<input type="number" min="1" max="10000" step="1" required bind:value={line.quantity} /></label><label class="gc-field">Requested value each (₹){#if 'denominations' in option}<select aria-label={'Requested value for ' + option.name} bind:value={line.value}>{#each option.denominations as denomination (denomination)}<option value={denomination}>{giftMoney(denomination)}</option>{/each}</select>{:else}<input type="number" min="100" max="100000" step="1" required bind:value={line.value} />{/if}</label></div>{#if validGiftLine(line)}<p class="gc-line-total">Requested face value <strong>{giftMoney(line.quantity * line.value)}</strong></p>{:else}<p class="gc-validation" role="alert">Enter a whole quantity from 1 to 10,000 and {'denominations' in option ? 'choose a listed face value.' : 'a whole rupee value from ₹100 to ₹1,00,000.'}</p>{/if}</div>{/each}
			<div class="gc-total"><span>{valid ? quantity.toLocaleString('en-IN') : '—'} vouchers · requested face value</span><strong>{valid ? giftMoney(total) : '—'}</strong></div><p class="gc-small">Planning amount only. It excludes any fees or taxes and is not an offered price. Brand availability, supported values and terms require confirmation.</p>
			{#if valid}<a class="button gc-enquire" href={resolve(enquiryHref as `/contact?${string}`)}>Continue to enquiry <Icon size={17} /></a>{:else}<button type="button" class="button gc-enquire" disabled>Complete your brief to continue</button>{/if}<p class="gc-small">You’ll review your requirements and add your contact details next.</p><button type="button" class="gc-text-button" onclick={() => { lines = []; announcement = 'Gift-card brief cleared.'; }}>Clear gift-card brief</button>
		{/if}{#if storageNotice}<p class="gc-validation" role="status">{storageNotice}</p>{/if}
	</div>
</div></section>
<section class="section gc-brand-directory" id="gift-card-brands"><div class="container"><p class="eyebrow">OFNEEDS GIFT CARDS & VOUCHERS</p><h2>Browse gift-card brands A–Z.</h2><p>Find a brand among {brandNames.length} distinct catalogue names, including Amazon gift cards, Starbucks, Wildcraft and William Penn. Choose a name to see its gift-card options. Sourcing and terms are confirmed with your quotation.</p><details><summary>View all {brandNames.length} gift-card names</summary><ul>{#each brandNames as brand (brand)}<li><a href={resolve(giftBrandHref(brand) as `/gift-cards/${string}`)}>{brand}</a></li>{/each}</ul></details></div></section>
<section class="section gc-faq"><div class="container"><div><p class="eyebrow">A FEW USEFUL DETAILS</p><h2>Before you send your brief.</h2></div><div>{#each giftSeo.faqs ?? [] as faq (faq.question)}<details><summary>{faq.question}</summary><p>{faq.answer}</p></details>{/each}</div></div></section>
<div class="gc-sr" aria-live="polite" role="status">{announcement}</div>
<noscript><div class="container gc-notice">Enable JavaScript to browse all gift cards and build your brief, or <a href={resolve('/contact?interest=gift-cards#quote')}>contact OfNeeds about gift cards</a>.</div></noscript>
