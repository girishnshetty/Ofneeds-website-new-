<script lang="ts">
 import { resolve } from '$app/paths';
 import { enhance } from '$app/forms';
 import { page } from '$app/state';
 import { onMount, tick } from 'svelte';
 import { site, contactNumbers, whatsappUrl } from '$lib/data/site';
 import { quote, quoteSummary } from '$lib/quote';
 import { track } from '$lib/analytics';
 import { validateLead } from '$lib/lead-validation';
 import { giftQueryPrefill } from '$lib/gift-cards';
 import QuoteShortlist from './QuoteShortlist.svelte';
 import Icon from './Icon.svelte';
 type Result = { success?: boolean; message?: string; errors?: Record<string, string>; values?: Record<string, string>; leadId?: string };
 let { enabled = false, initial }: { enabled?: boolean; initial?: Result | null } = $props();
 let mode = $state<'auto' | 'tally' | 'brief'>('auto');
 let tallyLoaded = $state(false);
 let enquiryOverride = $state<string | null>(null);
 let sending = $state(false);
 let result = $state<Result | null>();
 let draft = $state('');
 let draftSummary = $state('');
 let submissionKey = $state('');
 const response = $derived(result ?? initial);
 const enquiryType = $derived(enquiryOverride ?? response?.values?.enquiryType ?? 'buyer');
 const giftPrefill = $derived(enquiryType === 'buyer' ? giftQueryPrefill(page.url.searchParams) : { requirement: '', quantity: '' });
 const selectedMode = $derived(enquiryType !== 'buyer' ? 'brief' : mode === 'auto' ? (enabled || $quote.length || page.url.searchParams.has('brand') || page.url.searchParams.has('catalogue') || page.url.searchParams.has('interest') ? 'brief' : 'tally') : mode);
 const summary = $derived(enquiryType === 'buyer' ? quoteSummary($quote) : '');
 const tallyUrl = $derived.by(() => { const url = new URL(site.tally); if (summary) url.searchParams.set('quote_items', summary); return url.toString(); });
 const fields = [
  { name: 'name', label: 'Full Name', type: 'text', required: true, autocomplete: 'name' },
  { name: 'company', label: 'Company Name', type: 'text', required: true, autocomplete: 'organization' },
  { name: 'email', label: 'Work Email', type: 'email', required: true, autocomplete: 'email' },
  { name: 'phone', label: 'Contact Number', type: 'tel', required: true, autocomplete: 'tel' },
  { name: 'quantity', label: 'Approximate Recipients / Units', type: 'number', required: true, autocomplete: 'off' },
  { name: 'budget', label: 'Budget Per Recipient (₹)', type: 'number', required: false, autocomplete: 'off' },
  { name: 'deliveryDate', label: 'Requested Delivery Date', type: 'date', required: false, autocomplete: 'off' },
  { name: 'deliveryCity', label: 'Delivery City', type: 'text', required: true, autocomplete: 'address-level2' }
 ] as const;
 const visibleFields = $derived(fields.filter(field => enquiryType === 'buyer' || !['quantity', 'budget', 'deliveryDate'].includes(field.name)));
 function changeEnquiry(value: string) { enquiryOverride = value; mode = 'brief'; result = null; draft = ''; }
 const fieldIds: Record<string, string> = { productRequirement: 'quote-product', brandingRequirements: 'quote-branding', notes: 'quote-notes', ...Object.fromEntries(fields.map(field => [field.name, 'quote-' + field.name])) };
 async function focusFeedback() { await tick(); document.getElementById('quote-feedback')?.focus(); }
 onMount(() => { submissionKey = crypto.randomUUID(); });
 function buildDraft(event: SubmitEvent) {
  draft = '';
  if (enabled) return;
  event.preventDefault();
  const data = new FormData(event.currentTarget as HTMLFormElement);
  draftSummary = summary;
  const originalRequirement = String(data.get('productRequirement') || '');
  if (summary) data.set('productRequirement', [summary, originalRequirement].filter(Boolean).join('\n\n'));
  const parsed = validateLead(data);
  if (Object.keys(parsed.errors).length) { result = { values: { ...parsed.values, productRequirement: originalRequirement }, errors: parsed.errors, message: 'Please check the highlighted fields.' }; void focusFeedback(); return; }
  result = null;
  draft = `Hi OfNeeds, ${enquiryType === 'supplier' ? 'I would like to introduce our company as a supplier.' : enquiryType === 'other' ? 'please help with the enquiry below.' : 'please help us with a corporate gifting quotation.'}\n\nEnquiry type: ${enquiryType}\n${summary ? 'Selected products:\n' + summary + '\n\n' : ''}Name: ${data.get('name')}\nCompany: ${data.get('company')}\nWork Email: ${data.get('email')}\nContact: ${data.get('phone')}\nRequirement: ${originalRequirement || 'Products listed above'}\n${enquiryType === 'buyer' ? `Approximate recipients / units: ${data.get('quantity')}\nBudget per recipient: ${data.get('budget') ? '₹' + data.get('budget') : 'To discuss'}\nBranding: ${data.get('brandingRequirements') || 'To discuss'}\nRequested date: ${data.get('deliveryDate') || 'To discuss'}\n` : ''}City / coverage: ${data.get('deliveryCity')}\nAdditional details: ${data.get('notes') || 'None'}\n\n${enquiryType === 'supplier' ? 'Please let me know your supplier review process. This is an introduction, not an approved supplier registration.' : 'Please confirm specifications, availability, commercial terms and next steps.'}`;
 }
</script>
<section id="quote" class="section quote-section">
 <div class="container quote-layout">
  <div class="quote-intro"><p class="eyebrow">Your brief. Our next conversation.</p><h2>Make your next<br />gift count.</h2><p>Tell us who you’re gifting, what you have in mind and when you need it. We’ll help you shape the right selection.</p><ol class="quote-steps"><li><span>01</span>Choose products & quantities</li><li><span>02</span>Share branding & delivery details</li><li><span>03</span>Receive a manual quotation</li></ol><p class="fineprint">Pricing, availability and delivery are confirmed by our team. This is an enquiry, with no payment or commitment.</p>
   <div class="contact-lines"><a href={'mailto:' + site.email}><Icon name="mail" size={20} />{site.email}</a>{#each contactNumbers as phone (phone.href)}<a href={'tel:' + phone.href}><Icon name="phone" size={20} />{phone.display}</a>{/each}<p><Icon name="pin" size={20} />{site.location}</p></div>
  </div>
  <div class="quote-panel">
   <fieldset class="enquiry-audience"><legend>How can we help?</legend><div>{#each [{ id: 'buyer', label: 'Buyer' }, { id: 'supplier', label: 'Supplier / brand' }, { id: 'other', label: 'Other enquiry' }] as audience (audience.id)}<label class:chosen={enquiryType === audience.id}><input type="radio" name="enquiry-audience" value={audience.id} checked={enquiryType === audience.id} onchange={() => changeEnquiry(audience.id)} />{audience.label}</label>{/each}</div></fieldset>
   {#if enquiryType === 'buyer'}<QuoteShortlist />{/if}
   <div class="form-tabs" role="group" aria-label="Enquiry options"><button type="button" class:active={selectedMode === 'brief'} aria-pressed={selectedMode === 'brief'} onclick={() => { mode = 'brief'; track('Quote Started', { item_count: $quote.length }); }}>{enabled ? 'Detailed quote' : 'Build your brief'}</button>{#if enquiryType === 'buyer'}<button type="button" class:active={selectedMode === 'tally'} aria-pressed={selectedMode === 'tally'} onclick={() => { mode = 'tally'; track('Quote Started', { item_count: $quote.length }); }}>Enquiry form</button>{/if}</div>
   {#if selectedMode === 'tally'}
    <h3>Get My Corporate Quote</h3><p class="fineprint">Our existing enquiry form is hosted by Tally. You can also <a href={tallyUrl} target="_blank" rel="external noopener noreferrer">open it in a new tab</a>.</p>
    {#if summary}<label class="field" for="tally-summary">Your selected products<textarea id="tally-summary" readonly rows="4" value={summary}></textarea></label><p class="fineprint">Copy this summary into the form’s requirements field. Automatic field mapping depends on the Tally form configuration; your shortlist stays here.</p>{/if}
    {#if tallyLoaded}<iframe title="OfNeeds corporate enquiry form" src={site.tally} height="760" onload={(event) => (event.currentTarget as HTMLIFrameElement).focus()}></iframe>{:else}<div class="tally-launch"><p>Share your contact details and gifting requirements with our team.</p><button type="button" class="button" onclick={() => { tallyLoaded = true; track('Quote Started', { item_count: $quote.length }); }}>Start enquiry <Icon size={18} /></button><p class="fineprint">Opens the Tally enquiry form here. You can also use the link above to open it in a new tab.</p></div>{/if}
   {:else}
    <h3>{enquiryType === 'supplier' ? 'Introduce your products to OfNeeds' : enquiryType === 'other' ? 'Let’s start a conversation' : enabled ? 'Get My Corporate Quote' : 'Tell us what you have in mind'}</h3><p class="fineprint">{enquiryType === 'supplier' ? 'Tell us about your product range, branding capabilities and coverage. Every introduction is reviewed individually.' : enabled ? 'Complete the brief below to send it to our team.' : 'Build your requirement below, then review and send it on WhatsApp.'}</p>
    {#if response?.success}<div class="form-success" id="quote-feedback" tabindex="-1" role="status"><Icon name="check" /><h4>Thank you for your enquiry.</h4><p>{response.message}</p><p class="fineprint">Reference: {response.leadId}</p><p>Your shortlist has been kept for reference.</p></div>
    {:else}
     <form method="POST" action="/contact?/quote" onsubmit={buildDraft} oninput={() => { draft = ''; }} use:enhance={({ cancel }) => {
      if (!enabled || sending) { cancel(); return; }
      sending = true;
      track('Quote Started', { item_count: $quote.length });
      return async ({ result: actionResult }) => {
       sending = false;
       if (actionResult.type === 'success' || actionResult.type === 'failure') {
        result = actionResult.data as Result;
        if (result.success) track('Quote Submitted', { item_count: $quote.length });
       } else result = { message: 'We could not confirm receipt. Your selections are saved. Please retry or contact our team.' };
       void focusFeedback();
      };
     }}>
      {#if response?.message}<div class="form-error-summary" id="quote-feedback" tabindex="-1" role="alert"><p>{response.message}</p>{#if response.errors}<ul>{#each Object.entries(response.errors) as [name, message] (name)}{#if fieldIds[name]}<li><a href={'#' + fieldIds[name]}>{message}</a></li>{/if}{/each}</ul>{/if}</div>{/if}
      <div class="form-grid">
       {#each visibleFields as field (field.name)}<div class="field"><label for={'quote-' + field.name}>{field.name === 'deliveryCity' && enquiryType !== 'buyer' ? 'City / coverage' : field.label}{#if field.required}<span aria-hidden="true"> *</span>{/if}</label><input id={'quote-' + field.name} name={field.name} type={field.type} required={field.required} autocomplete={field.autocomplete} min={field.type === 'number' ? (field.name === 'quantity' ? '1' : '0') : undefined} max={field.type === 'number' ? '100000000' : undefined} step={field.type === 'number' && field.name === 'quantity' ? '1' : undefined} maxlength={field.type === 'email' ? 254 : field.type === 'tel' ? 30 : field.type === 'text' ? 200 : undefined} value={response?.values?.[field.name] ?? (field.name === 'quantity' ? giftPrefill.quantity || ($quote.length ? Math.max(...$quote.map((item) => item.quantity)) : '') : '')} aria-invalid={response?.errors?.[field.name] ? 'true' : undefined} aria-describedby={response?.errors?.[field.name] ? 'error-' + field.name : undefined} />{#if response?.errors?.[field.name]}<small class="field-error" id={'error-' + field.name}>{response.errors[field.name]}</small>{/if}</div>{/each}
       <div class="field field-full"><label for="quote-product">{enquiryType === 'supplier' ? 'Product range & capabilities' : enquiryType === 'other' ? 'Your enquiry' : 'Product requirement'}{#if !summary} *{/if}</label><textarea id="quote-product" name="productRequirement" required={!summary} rows="2" maxlength="2000" placeholder={enquiryType === 'supplier' ? 'Product categories, customisation, catalogue and supply capabilities' : enquiryType === 'other' ? 'How can our team help?' : summary ? 'Anything else to add to your selected products?' : 'Welcome kits, apparel, bottles, awards…'} aria-invalid={response?.errors?.productRequirement ? 'true' : undefined} aria-describedby={response?.errors?.productRequirement ? 'error-productRequirement' : undefined}>{response?.values?.productRequirement ?? (page.url.searchParams.get('interest') === 'gift-cards' && enquiryType === 'buyer' ? giftPrefill.requirement || 'Gift card sourcing enquiry. Please confirm available brands, denominations, validity and delivery options.' : page.url.searchParams.get('interest') === 'procurement' ? 'Please discuss a shared procurement workspace and our team requirements.' : page.url.searchParams.get('catalogue') ? 'Please share catalogue: ' + page.url.searchParams.get('catalogue') : page.url.searchParams.get('brand') ? 'Please confirm sourcing and availability for: ' + page.url.searchParams.get('brand') : '')}</textarea>{#if response?.errors?.productRequirement}<small class="field-error" id="error-productRequirement">{response.errors.productRequirement}</small>{/if}</div>
       <div class="field field-full"><label for="quote-branding">Logo & Branding Requirements</label><textarea id="quote-branding" name="brandingRequirements" rows="2" maxlength="1000" aria-invalid={response?.errors?.brandingRequirements ? 'true' : undefined} aria-describedby={response?.errors?.brandingRequirements ? 'error-brandingRequirements' : undefined} placeholder="Logo placement, preferred branding method, packaging or a welcome message">{response?.values?.brandingRequirements ?? ''}</textarea>{#if response?.errors?.brandingRequirements}<small class="field-error" id="error-brandingRequirements">{response.errors.brandingRequirements}</small>{/if}</div>
       <div class="field field-full"><label for="quote-notes">Special Instructions</label><textarea id="quote-notes" name="notes" rows="3" maxlength="4000" aria-invalid={response?.errors?.notes ? 'true' : undefined} aria-describedby={response?.errors?.notes ? 'error-notes' : undefined} placeholder="Recipient sizes, multiple destinations or other requirements">{response?.values?.notes ?? ''}</textarea>{#if response?.errors?.notes}<small class="field-error" id="error-notes">{response.errors.notes}</small>{/if}</div>
       <div class="form-trap" aria-hidden="true"><label for="quote-website">Website</label><input id="quote-website" name="website" tabindex="-1" autocomplete="off" /></div>
       <input type="hidden" name="enquiryType" value={enquiryType} /><input type="hidden" name="source" value={page.url.pathname} /><input type="hidden" name="selectedProducts" value={JSON.stringify(enquiryType === 'buyer' ? $quote : [])} /><input type="hidden" name="submissionKey" value={submissionKey} />
       <div class="field-full"><p class="fineprint">Share artwork with our team after your enquiry. By sending a brief you ask OfNeeds to contact you about this requirement. Read our <a href={resolve("/privacy-policy")}>privacy information</a>.</p><button class="button" type="submit" disabled={sending}>{sending ? 'Sending…' : enabled ? 'Request My Corporate Quote' : 'Prepare WhatsApp Enquiry'}<Icon size={18} /></button></div>
      </div>
     </form>
    {/if}
    {#if draft && draftSummary === summary}<div class="draft-result" role="status"><h4>Your brief is ready to review.</h4><p>It has not been submitted. Choosing the link below opens WhatsApp with these details; review and send the message there.</p><pre class="brief-preview">{draft}</pre><a class="button" href={whatsappUrl(draft)} target="_blank" rel="external noopener noreferrer">Open WhatsApp with My Brief ↗</a></div>{/if}
   {/if}
   <noscript><p>JavaScript is needed for the shortlist and WhatsApp brief builder. <a href={site.tally} rel="external">Open the existing enquiry form</a> or contact our team directly.</p></noscript>
  </div>
 </div>
</section>
