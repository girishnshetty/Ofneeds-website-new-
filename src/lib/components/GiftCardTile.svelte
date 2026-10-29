<script lang="ts">
	import type { GiftOption } from '$lib/gift-card-catalogue';
	import { giftMoney } from '$lib/gift-cards';
	import Icon from './Icon.svelte';
	import { resolve } from '$app/paths';
	import { giftBrandHref } from '$lib/gift-card-brands';
	let { option, selected, limitReached, onadd }: { option: GiftOption; selected: boolean; limitReached: boolean; onadd: (id: string, value: number, quantity: number) => void } = $props();
	let value = $state<number | undefined>();
	let quantity = $state(1);
	let logoFailed = $state(false);
	const amount = $derived(value ?? option.denominations[0]);
	const valid = $derived(Number.isInteger(quantity) && quantity >= 1 && quantity <= 10000);
	const listingLabel = $derived(option.copies > 1 ? `${option.name}, listing ${option.listing}` : option.name);
</script>

<article class="gc-option gc-brand-tile" data-gift-id={option.id}>
	<div class="gc-logo-box" class:gc-logo-dark={option.logo?.dark}>
		{#if option.logo && !logoFailed}<img src={option.logo.src} alt={option.name + ' logo'} width={option.logo.width} height={option.logo.height} loading="lazy" decoding="async" onerror={() => logoFailed = true} />{:else}<span class="gc-logo-fallback">{option.name}</span>{/if}
	</div>
	<div class="gc-card-body"><span class="gc-option-label">INDIA · QUOTE ON REQUEST</span><h3><a href={resolve(giftBrandHref(option.name) as `/gift-cards/${string}`)}>{option.name}</a></h3>{#if option.copies > 1}<span class="gc-duplicate-label">Listing {option.listing} of {option.copies}</span>{/if}
		<div class="gc-tile-controls"><label class="gc-field">Gift-card value<select aria-label={'Gift-card value for ' + listingLabel} value={amount} onchange={event => value = Number(event.currentTarget.value)}>{#each option.denominations as denomination (denomination)}<option value={denomination}>{giftMoney(denomination)}</option>{/each}</select></label><label class="gc-field">Quantity<input aria-label={'Quantity for ' + listingLabel} type="number" min="1" max="10000" step="1" bind:value={quantity} /></label></div>
		{#if !valid}<p class="gc-validation">Use a whole quantity from 1 to 10,000.</p>{/if}
		<details><summary>Gift-card details</summary><p>Choose a listed face value and request a quotation. Availability, validity, redemption rules, fees and delivery will be confirmed by OfNeeds.</p></details>
		{#if selected}<a class="gc-added" href="#gift-brief"><Icon name="check" size={16} /> Added · edit your brief ↓</a>{:else}<button type="button" class="button button-outline" aria-label={'Add ' + listingLabel + ' to brief'} disabled={!valid || limitReached} onclick={() => onadd(option.id, amount, quantity)}>{limitReached ? 'Brief full · edit below' : 'Add to brief'} <span aria-hidden="true">+</span></button>{/if}
	</div>
</article>
