<script lang="ts">
	import { resolve } from '$app/paths';
	import type { GiftBrand } from '$lib/gift-card-brands';
	import { giftContactHref, giftMoney, validGiftLine } from '$lib/gift-cards';
	import Icon from './Icon.svelte';
	let { brand }: { brand: GiftBrand } = $props();
	let selectedId = $state('');
	let selectedValue = $state<number | undefined>();
	let quantity = $state(100);
	let occasion = $state('Employee recognition');
	const option = $derived(brand.options.find(item => item.id === selectedId) ?? brand.options[0]);
	const value = $derived(selectedValue ?? option.denominations[0]);
	const line = $derived({ id: option.id, value, quantity, brand: '' });
	const valid = $derived(validGiftLine(line));
	const href = $derived(valid ? giftContactHref({ lines: [line], occasion }) : '');
</script>

<div class="gb-enquiry" id="brand-enquiry"><p class="eyebrow">YOUR REQUIREMENT · OUR NEXT CONVERSATION</p><h2>Enquire about {brand.label}.</h2><p>Select a value and quantity for your quotation request.</p>
	{#if brand.options.length > 1}<label>Catalogue option<select aria-label="Catalogue option" value={option.id} onchange={event => { selectedId = event.currentTarget.value; selectedValue = undefined; }}>{#each brand.options as item (item.id)}<option value={item.id}>{item.name}{item.copies > 1 ? ` · Listing ${item.listing} of ${item.copies}` : ''}</option>{/each}</select></label>{/if}
	<div class="gb-inputs"><label>Gift-card value<select aria-label="Gift-card value" value={value} onchange={event => selectedValue = Number(event.currentTarget.value)}>{#each option.denominations as amount (amount)}<option value={amount}>{giftMoney(amount)}</option>{/each}</select></label><label>Number of vouchers<input type="number" min="1" max="10000" step="1" required bind:value={quantity} /></label></div>
	<label>Gifting occasion<select aria-label="Gifting occasion" bind:value={occasion}><option>Employee recognition</option><option>Festive gifting</option><option>Client appreciation</option><option>Sales incentives</option><option>Other programme</option></select></label>
	{#if valid}<div class="gb-request-total"><span>Requested face value</span><strong>{giftMoney(value * quantity)}</strong></div><p class="gb-fineprint">A planning amount, excluding any fees or taxes. Final availability, pricing and terms are confirmed by OfNeeds.</p><a class="button" href={resolve(href as `/contact?${string}`)}>Request {brand.label} gift cards <Icon size={17} /></a>{:else}<p class="gb-validation" role="alert">Enter a whole quantity from 1 to 10,000 and choose a listed value.</p><button class="button" type="button" disabled>Complete your requirement</button>{/if}
	<p class="gb-fineprint">Review your brief and add contact details next. No payment or voucher issuance takes place here.</p><noscript><p>To change the default values without JavaScript, describe your requirement on the contact form.</p></noscript>
</div>
