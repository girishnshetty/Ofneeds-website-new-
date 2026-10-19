<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { site, contactNumbers, whatsappUrl } from '$lib/data/site';
	import Icon from './Icon.svelte';
	type Result = {
		success?: boolean;
		message?: string;
		errors?: Record<string, string>;
		values?: Record<string, string>;
		leadId?: string;
	};
	let { enabled = false, initial }: { enabled?: boolean; initial?: Result | null } = $props();
	let mode = $state<'auto' | 'tally' | 'brief'>('auto');
	const selectedMode = $derived(mode === 'auto' ? (enabled ? 'brief' : 'tally') : mode);
	let sending = $state(false);
	let result = $state<Result | null | undefined>();
	let draft = $state('');
	const response = $derived(result ?? initial);
	const fields = [
		{ name: 'name', label: 'Full Name', type: 'text', required: true, autocomplete: 'name' },
		{
			name: 'company',
			label: 'Company Name',
			type: 'text',
			required: true,
			autocomplete: 'organization'
		},
		{ name: 'email', label: 'Work Email', type: 'email', required: true, autocomplete: 'email' },
		{ name: 'phone', label: 'Phone Number', type: 'tel', required: true, autocomplete: 'tel' },
		{
			name: 'quantity',
			label: 'Estimated Quantity',
			type: 'number',
			required: true,
			autocomplete: 'off'
		},
		{
			name: 'budget',
			label: 'Budget Per Person (₹)',
			type: 'number',
			required: false,
			autocomplete: 'off'
		},
		{
			name: 'deliveryDate',
			label: 'Required Delivery Date',
			type: 'date',
			required: false,
			autocomplete: 'off'
		},
		{
			name: 'deliveryCity',
			label: 'Delivery City',
			type: 'text',
			required: true,
			autocomplete: 'address-level2'
		}
	] as const;
	function buildDraft(event: SubmitEvent) {
		if (enabled) return;
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		draft = `Hi OfNeeds, I'm looking for corporate gifting options.\n\nName: ${data.get('name')}\nCompany: ${data.get('company')}\nWork Email: ${data.get('email')}\nPhone: ${data.get('phone')}\nProduct Requirement: ${data.get('productRequirement')}\nQuantity: ${data.get('quantity')}\nBudget: ${data.get('budget') || 'Please advise'}\nDelivery Date: ${data.get('deliveryDate') || 'To discuss'}\nDelivery City: ${data.get('deliveryCity')}\nAdditional Requirements: ${data.get('notes') || 'None'}`;
	}
</script>

<section id="quote" class="section quote-section">
	<div class="container quote-layout">
		<div class="quote-intro">
			<p class="eyebrow">Let’s create something considered</p>
			<h2>Your next gifting<br /> project starts here.</h2>
			<p>
				Share your brief. We’ll help you find the right products, branding and packaging for your
				team.
			</p>
			<div class="contact-lines">
				<a href={'mailto:' + site.email}><Icon name="mail" size={20} />{site.email}</a>
				{#each contactNumbers as phone (phone.href)}
					<a href={'tel:' + phone.href}><Icon name="phone" size={20} />{phone.display}</a>
				{/each}
				<p><Icon name="pin" size={20} />{site.location}</p>
			</div>
			<a class="text-link" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"
				>Prefer a conversation? WhatsApp Us <Icon size={17} /></a
			>
		</div>
		<div class="quote-panel">
			<div class="form-tabs" role="group" aria-label="Enquiry options">
				<button
					type="button"
					class:active={selectedMode === 'tally'}
					aria-pressed={selectedMode === 'tally'}
					onclick={() => (mode = 'tally')}>Enquiry form</button
				><button
					type="button"
					class:active={selectedMode === 'brief'}
					aria-pressed={selectedMode === 'brief'}
					onclick={() => (mode = 'brief')}>{enabled ? 'Detailed quote' : 'Build your brief'}</button
				>
			</div>
			{#if selectedMode === 'tally'}<h3>Get My Corporate Quote</h3>
				<p class="fineprint">
					Our secure enquiry form. You can also <a
						href={site.tally}
						target="_blank"
						rel="noopener noreferrer">open it in a new tab</a
					>.
				</p>
				<iframe title="OfNeeds corporate enquiry form" src={site.tally} loading="lazy" height="760"
				></iframe>
			{:else}<h3>{enabled ? 'Get My Corporate Quote' : 'Tell us what you have in mind'}</h3>
				<p class="fineprint">
					{enabled
						? 'Complete the brief below to send it to our team.'
						: 'Build your requirement below, then send it to our team on WhatsApp.'}
				</p>
				{#if response?.success}<div class="form-success" role="status">
						<Icon name="check" />
						<h4>Thank you for your enquiry.</h4>
						<p>{response.message}</p>
						<p class="fineprint">Reference: {response.leadId}</p>
					</div>{:else}
					<form
						method="POST"
						action="/contact?/quote"
						onsubmit={buildDraft}
						use:enhance={({ cancel }) => {
							if (!enabled) {
								cancel();
								return;
							}
							sending = true;
							return async ({ result: actionResult }) => {
								sending = false;
								if (actionResult.type === 'success' || actionResult.type === 'failure') {
									result = actionResult.data as Result;
								} else {
									result = {
										message:
											'We could not send your enquiry. Please use the enquiry form or contact our team directly.'
									};
								}
							};
						}}
					>
						<div class="form-grid">
							{#each fields as field (field.name)}<div class="field">
									<label for={'quote-' + field.name}
										>{field.label}{#if field.required}<span aria-hidden="true"> *</span>{/if}</label
									><input
										id={'quote-' + field.name}
										name={field.name}
										type={field.type}
										required={field.required}
										autocomplete={field.autocomplete}
										pattern={field.type === 'tel' ? '\\+?[0-9 \\(\\)\\.\\-]{8,30}' : undefined}
										min={field.type === 'number'
											? field.name === 'quantity'
												? '1'
												: '0'
											: undefined}
										max={field.type === 'number' ? '100000000' : undefined}
										maxlength={field.type === 'text'
											? 200
											: field.type === 'email'
												? 254
												: field.type === 'tel'
													? 30
													: undefined}
										value={response?.values?.[field.name] ?? ''}
										aria-invalid={response?.errors?.[field.name] ? 'true' : undefined}
										aria-describedby={response?.errors?.[field.name]
											? 'error-' + field.name
											: undefined}
									/>{#if response?.errors?.[field.name]}<small
											class="field-error"
											id={'error-' + field.name}>{response.errors[field.name]}</small
										>{/if}
								</div>{/each}
							<div class="field field-full">
								<label for="quote-product"
									>Product Requirement <span aria-hidden="true">*</span></label
								><textarea
									id="quote-product"
									name="productRequirement"
									required
									rows="2"
									maxlength="2000"
									placeholder="Welcome kits, apparel, bottles, awards…"
									aria-invalid={response?.errors?.productRequirement ? 'true' : undefined}
									>{response?.values?.productRequirement ?? ''}</textarea
								>{#if response?.errors?.productRequirement}<small class="field-error"
										>{response.errors.productRequirement}</small
									>{/if}
							</div>
							<div class="field field-full">
								<label for="quote-notes">Additional Requirements</label><textarea
									id="quote-notes"
									name="notes"
									rows="3"
									maxlength="4000"
									placeholder="Branding, packaging, preferred items or delivery details"
									>{response?.values?.notes ?? ''}</textarea
								>
							</div>
							<div class="form-trap" aria-hidden="true">
								<label for="quote-website">Website</label><input
									id="quote-website"
									name="website"
									tabindex="-1"
									autocomplete="off"
								/>
							</div>
							<input type="hidden" name="source" value={page.url.pathname} />
							<div class="field-full">
								<p class="fineprint">
									Share logo files directly with our team after your enquiry. See our <a
										href="/privacy-policy">privacy information</a
									>.
								</p>
								{#if response?.message}<p class="field-error" role="alert">
										{response.message}
									</p>{/if}<button class="button" type="submit" disabled={sending}
									>{sending
										? 'Sending…'
										: enabled
											? 'Get My Corporate Quote'
											: 'Prepare WhatsApp Enquiry'}<Icon size={18} /></button
								>
							</div>
						</div>
					</form>{/if}
				{#if draft}<div class="draft-result" role="status">
						<h4>Your brief is ready.</h4>
						<p>Send it on WhatsApp to request a quotation. It has not been submitted yet.</p>
						<a class="button" href={whatsappUrl(draft)} target="_blank" rel="noopener noreferrer"
							>Send Requirement on WhatsApp <Icon size={18} /></a
						>
					</div>{/if}
			{/if}<noscript
				><p>
					JavaScript is needed for the brief builder. Use the enquiry form above, <a
						href={site.tally}>open the enquiry form</a
					>, or contact our team directly.
				</p></noscript
			>
		</div>
	</div>
</section>
