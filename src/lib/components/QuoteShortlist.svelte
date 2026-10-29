<script lang="ts">
 import { resolve } from '$app/paths';
	import { quote, quoteStorageAvailable } from '$lib/quote';
	import { productFor } from '$lib/data/products';
</script>
<div class="quote-shortlist">
	<div class="shortlist-heading"><h3>Your quote shortlist <span>({$quote.length})</span></h3><a class="text-link" href={resolve("/products")}>Add products →</a></div>
	{#if $quote.length}<ul>{#each $quote as item (item.id)}{@const product = productFor(item.id)!}<li><div><a href={resolve((product.href) as `/${string}`)}>{product.name}</a><small>Availability and specifications to confirm</small></div><label for={'qty-' + item.id}>Quantity<input id={'qty-' + item.id} aria-label={'Quantity for ' + product.name} type="number" min="1" max="1000000" step="1" required value={item.quantity} oninput={(event) => { const value = event.currentTarget.valueAsNumber; if (Number.isSafeInteger(value) && value > 0 && value <= 1000000) quote.setQuantity(item.id, value); }} onblur={(event) => { event.currentTarget.value = String(item.quantity); }} /></label><button class="remove-item" type="button" aria-label={'Remove ' + product.name} onclick={() => quote.remove(item.id)}>×</button></li>{/each}</ul><p class="fineprint">A quotation request, with no payment or stock reservation. Saved in this browser tab until you clear it.</p><button type="button" class="text-button" onclick={() => quote.clear()}>Clear shortlist</button>{:else}<p>No products selected yet. <a href={resolve("/products")}>Explore products</a> or describe your requirement below.</p>{/if}
	{#if $quote.length}<p><a class="text-link" href={resolve('/workspace')}>Plan this shortlist in the buyer workspace →</a></p>{/if}
	{#if !$quoteStorageAvailable}<p class="field-error" role="status">Browser storage is unavailable. Keep this page open to retain your selections.</p>{/if}
</div>
