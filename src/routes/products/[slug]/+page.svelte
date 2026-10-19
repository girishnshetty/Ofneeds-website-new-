<script lang="ts">
 import { resolve } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import { quote } from '$lib/quote';
	import { whatsappUrl } from '$lib/data/site';
	import { track } from '$lib/analytics';
	import { afterNavigate } from '$app/navigation';
	let { data } = $props();
	const product = $derived(data.product);
	let quantity = $state(1);
	let added = $state(false);
	let imageIndex = $state(0);
	const gallery = $derived(product.gallery?.length ? product.gallery : [product.photo]);
	const image = $derived(gallery[imageIndex] || gallery[0]);
	afterNavigate(() => { quantity = 1; added = false; imageIndex = 0; track('Product Viewed', { product_id: product.id }); });
	const valid = $derived(Number.isSafeInteger(quantity) && quantity >= 1 && quantity <= 1000000);
</script>
<Seo title={product.name + ' for Corporate Gifting | OfNeeds'} description={product.description + ' Explore this corporate gifting selection and request confirmed specifications, availability, branding and pricing from OfNeeds.'} crumb={product.name} image={product.photo} />
<section class="section"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href={resolve("/")}>Home</a><span>/</span><a href={resolve("/products")}>Products</a><span>/</span><span>{product.name}</span></nav><div class="product-detail-layout">
	<figure class="detail-image"><img src={image.src} srcset={image.srcset} sizes="(max-width: 760px) 90vw, 46vw" width={image.width} height={image.height} alt={image.alt} fetchpriority="high" style:object-fit={image.fit} /><div class="gallery-thumbnails">{#if gallery.length > 1}{#each gallery as photo, index (photo.src)}<button type="button" aria-label={'View image ' + (index + 1) + ' of ' + product.name} aria-pressed={imageIndex === index} onclick={() => imageIndex = index}><img src={photo.src} alt={photo.alt} width="64" height="64" loading="lazy" /></button>{/each}{/if}</div><figcaption>Reference presentation. Exact models, colours and final branding are confirmed during quotation.</figcaption></figure>
	<div class="detail-copy"><p class="eyebrow">{product.category}</p><h1>{product.name}</h1><p>{product.description}</p><strong class="detail-price">{product.priceVerified && product.price !== null ? `₹${product.price.toLocaleString('en-IN')} / kit` : 'Contact for Pricing'}</strong><p class="fineprint">Confirm Availability · Request for quotation</p>
	{#if product.inclusions}<h2>Package inclusions</h2><ul class="inclusions">{#each product.inclusions as item (item)}<li>{item}</li>{/each}</ul>{/if}
	<dl class="specifications"><div><dt>SKU / product code</dt><dd>{product.sku || 'Model selected during quotation'}</dd></div><div><dt>Material</dt><dd>{product.material || 'Confirm for your chosen model'}</dd></div><div><dt>Colours</dt><dd>{product.colours?.join(', ') || 'Confirm available options'}</dd></div><div><dt>Dimensions / capacity</dt><dd>{product.dimensions || 'Confirm for your chosen model'}</dd></div><div><dt>Minimum order quantity</dt><dd>{product.moq || 'Confirm with our team'}</dd></div><div><dt>Branding</dt><dd>{product.brandingMethods?.join(', ') || 'Method and logo placement confirmed after artwork review'}</dd></div></dl>
	<form class="detail-enquiry" onsubmit={(event) => { event.preventDefault(); if (valid) { quote.add(product.id, quantity); added = true; } }}><label for="detail-quantity">Approximate quantity<input id="detail-quantity" type="number" min="1" max="1000000" step="1" required bind:value={quantity} /></label><button class="button" type="submit" disabled={!valid}>Add to Quote →</button></form>
	{#if added}<p class="selection-feedback" role="status">Added to your shortlist. <a href={resolve("/contact#quote")}>Review quantities and send your brief →</a></p>{/if}
	<a class="text-link" href={whatsappUrl(`Hi OfNeeds, please quote for ${product.name}.\nApproximate quantity: ${valid ? quantity : 'To discuss'}.\nPlease confirm models, branding, GST, delivery and availability.`)} target="_blank" rel="external noopener noreferrer">WhatsApp Enquiry ↗</a><p class="fineprint">Prices are not an all-inclusive checkout total. GST, branding, packaging, delivery charges and production schedules are confirmed in a written quotation. Your requested date is subject to confirmation.</p><a class="text-link" href={resolve((product.categoryHref) as `/${string}`)}>Explore the category →</a></div>
</div></div></section>
<section class="section section-muted"><div class="container"><div class="section-heading"><div><p class="eyebrow">Complete your brief</p><h2>Related selections</h2></div><a class="text-link" href={resolve("/products")}>Explore all products →</a></div><ProductGrid items={data.related} /></div></section>
