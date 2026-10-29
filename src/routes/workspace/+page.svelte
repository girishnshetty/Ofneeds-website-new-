<script lang="ts">
 import { onMount, tick } from 'svelte';
 import { resolve } from '$app/paths';
 import Seo from '$lib/components/Seo.svelte';
 import Icon from '$lib/components/Icon.svelte';
 import { productSelections, productFor } from '$lib/data/products';
 import { quote } from '$lib/quote';
 import { whatsappUrl } from '$lib/data/site';
 import { emptyWorkspace, sampleWorkspace, restoreWorkspace, saveRequest, reviewRequest, advanceFulfilment, requestTotal, approvedTotal, hasEstimates, workspaceCsv, requestBrief, statusLabels, fulfilmentStages, type Workspace, type PurchaseRequest } from '$lib/procurement';
 import './workspace.css';

 const storageKey = 'ofneeds-procurement-v1';
 const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
 const date = (value: string) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
 let workspace = $state<Workspace>(emptyWorkspace());
 let ready = $state(false);
 let role = $state<'requester' | 'reviewer'>('requester');
 let selectedId = $state('');
 let search = $state('');
 let filter = $state('all');
 let feedback = $state('');
 let storageMessage = $state('');
 let storageBlocked = false;
 let editing = $state(false);
 let editingId = $state('');
 let title = $state('');
 let department = $state('');
 let reviewer = $state('');
 let locations = $state('');
 let neededBy = $state('');
 let notes = $state('');
 let lines = $state<{ id: string; name: string; quantity: number | undefined; estimate: number | undefined }[]>([]);
 let productId = $state(productSelections[0].id);
 let customName = $state('');
 let lineQuantity = $state<number | undefined>(1);
 let lineEstimate = $state<number | undefined>();
 let reviewNote = $state('');
 let progressNote = $state('');
 let budgetInput = $state<number | undefined>(100000);
 const selected = $derived(workspace.requests.find(r => r.id === selectedId));
 const approved = $derived(approvedTotal(workspace));
 const pending = $derived(workspace.requests.filter(r => r.status === 'pending'));
 const visible = $derived(workspace.requests.filter(r => (filter === 'all' || r.status === filter) && `${r.title} ${r.id} ${r.department}`.toLowerCase().includes(search.toLowerCase())));
 const budgetPercent = $derived(workspace.budget > 0 ? Math.min(100, approved / workspace.budget * 100) : approved > 0 ? 100 : 0);
 onMount(() => {
  try { const saved = localStorage.getItem(storageKey); if (saved) workspace = restoreWorkspace(saved); }
  catch { storageBlocked = true; storageMessage = 'Saved records could not be loaded. Existing storage has been left untouched. Changes in this session can only be exported.'; }
  budgetInput = workspace.budget;
  selectedId = workspace.requests[0]?.id || '';
  ready = true;
 });
 function persist(next: Workspace) {
  workspace = next;
  try { if (storageBlocked) return; localStorage.setItem(storageKey, JSON.stringify(next)); storageMessage = ''; }
  catch { storageMessage = 'Browser storage is unavailable or full. Changes are kept in this tab only; export your records before closing it.'; }
 }
 function act(action: () => Workspace, message: string) {
  try { persist(action()); feedback = message; }
  catch (error) { feedback = error instanceof Error ? error.message : 'The change could not be recorded.'; }
 }
 async function openEditor(request?: PurchaseRequest) {
  editingId = request?.id || '';
  title = request?.title || ''; department = request?.department || ''; reviewer = request?.reviewer || '';
  locations = request?.locations || ''; neededBy = request?.neededBy || ''; notes = request?.notes || '';
  lines = request ? request.lines.map(l => ({ ...l, estimate: l.estimate ?? undefined })) : $quote.map(item => {
   const product = productFor(item.id)!;
   return { id: item.id, name: product.name, quantity: item.quantity, estimate: product.priceVerified && product.price !== null ? product.price : undefined };
  });
  editing = true; feedback = ''; await tick(); document.getElementById('request-editor-heading')?.focus();
 }
 function setProduct() { const product = productFor(productId); lineEstimate = product?.priceVerified && product.price !== null ? product.price : undefined; }
 function addLine() {
  if (lines.length >= 30) { feedback = 'A request supports up to 30 product lines.'; return; }
  const name = productId === 'custom' ? customName.trim() : productFor(productId)?.name;
  if (!name || !Number.isSafeInteger(lineQuantity) || Number(lineQuantity) < 1 || Number(lineQuantity) > 1000000 || (lineEstimate !== undefined && (!Number.isFinite(lineEstimate) || lineEstimate < 0 || lineEstimate > 10000000))) { feedback = 'Choose a product, enter a whole quantity and check the estimate.'; return; }
  lines = [...lines, { id: productId, name, quantity: lineQuantity, estimate: lineEstimate }];
  feedback = ''; customName = ''; lineQuantity = 1;
 }
 function submit(event: SubmitEvent) {
  event.preventDefault();
  const submitForReview = (event.submitter as HTMLButtonElement)?.value === 'review';
  const id = editingId || 'OFN-' + crypto.randomUUID().slice(0, 8).toUpperCase();
  try {
   const next = saveRequest(workspace, { title, department, reviewer, locations, neededBy, notes, lines: lines.map(l => ({ ...l, quantity: Number(l.quantity), estimate: l.estimate ?? null })) }, id, submitForReview);
   persist(next); selectedId = id; filter = 'all'; search = ''; editing = false;
   feedback = submitForReview ? 'Request saved for local review. Switch to Reviewer view to record a decision. No notification has been sent.' : 'Draft saved in this browser.';
  } catch (error) { feedback = error instanceof Error ? error.message : 'Please check your request.'; }
 }
 function decide(decision: 'approve' | 'changes') {
  act(() => reviewRequest(workspace, selectedId, decision, reviewNote), decision === 'approve' ? 'Approval recorded in this browser. No order has been placed.' : 'Changes requested. Switch to Requester view to revise this request.');
  reviewNote = '';
 }
 function exportCsv() {
  const url = URL.createObjectURL(new Blob(['\uFEFF' + workspaceCsv(workspace)], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ofneeds-procurement.csv'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
 }
 function saveBudget(event: SubmitEvent) {
  event.preventDefault();
  if (!Number.isFinite(budgetInput) || Number(budgetInput) < approved || Number(budgetInput) > 1000000000) { feedback = 'The budget must cover existing approvals and be at most ₹1,000,000,000.'; return; }
  persist({ ...workspace, budget: Number(budgetInput) }); feedback = 'Planning budget updated in this browser.';
 }
</script>

<Seo title="Buyer Workspace | OfNeeds Procurement Planner" description="Plan corporate gifting requests, budgets and local review decisions in the OfNeeds buyer workspace preview." crumb="Buyer workspace" noindex />
<div class="buyer-workspace">
 <div class="container">
  <div class="workspace-breadcrumb"><a href={resolve('/')}>OfNeeds</a><span>/</span><span>Buyer workspace</span></div>
  <header class="workspace-heading"><div><p class="eyebrow">A little less coordination.</p><h1>Your gifting workspace.</h1><p>Bring the brief, budget and next step into one place.</p></div><div class="workspace-heading-actions"><button type="button" class="button button-outline" onclick={exportCsv} disabled={!ready || !workspace.requests.length}><Icon name="box" size={16} /> Export CSV</button><button type="button" class="button" onclick={() => { role = 'requester'; void openEditor(); }} disabled={!ready}>+ New request</button></div></header>
  <aside class="workspace-notice"><span class="workspace-preview-label">LOCAL PREVIEW</span><p>Records stay in this browser. Review decisions and progress are planning records, not account permissions or live orders. No supplier or reviewer is notified.</p></aside>
  {#if storageMessage}<div class="workspace-alert" role="alert">{storageMessage}</div>{/if}
  <div class="workspace-stats">
   <article><span>Requests</span><strong>{workspace.requests.length}</strong><small>Across all departments</small></article>
   <article><span>Awaiting review</span><strong>{pending.length}</strong><small>{money(pending.reduce((sum, r) => sum + requestTotal(r), 0))} in entered estimates</small></article>
   <article><span>Approved estimates</span><strong>{money(approved)}</strong><small>Planning allocation · not actual spend</small></article>
   <article><span>Budget remaining</span><strong>{money(Math.max(0, workspace.budget - approved))}</strong><small>Of {money(workspace.budget)} planning budget</small></article>
  </div>
  <section class="workspace-budget"><div><strong>Keep the plan in perspective.</strong><p>Estimates exclude unconfirmed GST, branding, packaging and delivery.</p><div class="workspace-budget-track" role="meter" aria-label="Planning budget allocated" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(budgetPercent)}><span style:width={budgetPercent + '%'}></span></div></div><form onsubmit={saveBudget}><label for="planning-budget">Planning budget (₹)</label><div><input id="planning-budget" type="number" min={approved} max="1000000000" step="0.01" required bind:value={budgetInput} disabled={!ready} /><button type="submit" class="button button-outline" disabled={!ready}>Save budget</button></div></form></section>
  <div class="workspace-controls"><div class="workspace-role" role="group" aria-label="Preview workflow role"><button type="button" class:active={role === 'requester'} aria-pressed={role === 'requester'} onclick={() => { role = 'requester'; }}>Requester view</button><button type="button" class:active={role === 'reviewer'} aria-pressed={role === 'reviewer'} onclick={() => { role = 'reviewer'; editing = false; }}>Reviewer view {#if pending.length}<span>{pending.length}</span>{/if}</button></div><p>Preview both sides of the workflow.</p></div>
  {#if feedback}<div class="workspace-feedback" role="status">{feedback}</div>{/if}
  {#if editing}
   <section class="workspace-editor workspace-card" aria-labelledby="request-editor-heading"><div class="workspace-card-heading"><div><p class="eyebrow">Build a better brief</p><h2 id="request-editor-heading" tabindex="-1">{editingId ? 'Revise your request' : 'Create a purchase request'}</h2></div><button type="button" class="text-button" onclick={() => { editing = false; }}>Cancel editing</button></div>
    <form onsubmit={submit}>
     <div class="workspace-fields">
      <label>Request title<input maxlength="120" required bind:value={title} placeholder="e.g. November welcome kits" /></label>
      <label>Department<input maxlength="80" required bind:value={department} placeholder="e.g. People Operations" /></label>
      <label>Reviewer name or team<input maxlength="100" required bind:value={reviewer} placeholder="e.g. Procurement team" /><small>A label for your plan; no invite is sent.</small></label>
      <label>Needed by<input type="date" bind:value={neededBy} /></label>
      <label class="workspace-full">Delivery locations<textarea rows="2" maxlength="500" required bind:value={locations} placeholder="e.g. Bengaluru — 40 kits; Hyderabad — 20 kits"></textarea></label>
     </div>
     <fieldset class="workspace-line-builder"><legend>Products &amp; quantities</legend><p>Use your website shortlist or add items below. Enter your own planning estimates; blank means a quotation is needed.</p><div class="workspace-line-inputs"><label>Product<select bind:value={productId} onchange={setProduct}>{#each productSelections as product (product.id)}<option value={product.id}>{product.name}</option>{/each}<option value="custom">Other / custom requirement</option></select></label>{#if productId === 'custom'}<label>Item name<input maxlength="150" bind:value={customName} placeholder="e.g. Gift vouchers — brands to confirm" /></label>{/if}<label>Quantity<input type="number" min="1" max="1000000" step="1" bind:value={lineQuantity} /></label><label>Estimate each (₹)<input type="number" min="0" max="10000000" step="0.01" bind:value={lineEstimate} placeholder="Quote needed" /></label><button type="button" class="button button-outline" onclick={addLine}>Add item</button></div>
      {#if lines.length}<div class="workspace-table-wrap"><table><caption class="workspace-sr-only">Items in this request</caption><thead><tr><th>Item</th><th>Quantity</th><th>Estimate each</th><th>Remove</th></tr></thead><tbody>{#each lines as line, i (i)}<tr><td>{line.name}</td><td><input aria-label={'Quantity for ' + line.name} type="number" required min="1" max="1000000" step="1" bind:value={line.quantity} /></td><td><input aria-label={'Estimate each for ' + line.name} type="number" min="0" max="10000000" step="0.01" bind:value={line.estimate} placeholder="Quote needed" /></td><td><button type="button" class="workspace-remove" aria-label={'Remove ' + line.name} onclick={() => { lines = lines.filter((_, index) => index !== i); }}>×</button></td></tr>{/each}</tbody></table></div>{:else}<div class="workspace-empty-lines">No items yet. Add a product or <a href={resolve('/products')}>build a shortlist</a>.</div>{/if}
     </fieldset>
     <label class="workspace-note-label">Branding &amp; other requirements<textarea maxlength="2000" rows="3" bind:value={notes} placeholder="Logo placement, packaging, sizes or special instructions"></textarea></label>
     <div class="workspace-editor-footer"><p>No payment or purchase commitment is made.</p><div><button type="submit" class="button button-outline" value="draft">Save draft</button><button type="submit" class="button" value="review">Request local review <Icon size={16} /></button></div></div>
    </form>
   </section>
  {/if}
  <div class="workspace-main-grid">
   <section class="workspace-card workspace-requests" aria-labelledby="requests-heading"><div class="workspace-card-heading"><h2 id="requests-heading">Your requests</h2><span>{visible.length} shown</span></div><div class="workspace-filters"><label><span class="workspace-sr-only">Search requests</span><input type="search" bind:value={search} placeholder="Search title, ID or department" /></label><label><span class="workspace-sr-only">Filter request status</span><select bind:value={filter}><option value="all">All statuses</option>{#each Object.entries(statusLabels) as [value, label] (value)}<option value={value}>{label}</option>{/each}</select></label></div>
    {#if !ready}<p class="workspace-empty">Loading browser workspace…</p>{:else if !workspace.requests.length}<div class="workspace-empty"><span class="workspace-empty-icon"><Icon name="box" size={32} /></span><h3>A clear brief starts here.</h3><p>Create your first request, or explore a fictional sample to try the review flow.</p><button type="button" class="button" onclick={() => { role = 'requester'; void openEditor(); }}>Create first request</button><button type="button" class="text-button" onclick={() => { if (!workspace.requests.length) { const sample = sampleWorkspace(); persist(sample); selectedId = sample.requests[0].id; budgetInput = sample.budget; feedback = 'Fictional sample requests loaded. All figures and progress are illustrative.'; } }}>Try sample requests</button></div>{:else if !visible.length}<div class="workspace-empty"><h3>No matching requests</h3><button type="button" class="text-button" onclick={() => { search = ''; filter = 'all'; }}>Clear filters</button></div>{:else}<ul class="workspace-request-list">{#each visible as request (request.id)}<li><button type="button" class:selected={selectedId === request.id} onclick={() => { selectedId = request.id; reviewNote = ''; progressNote = ''; }}><span class="workspace-request-meta"><span>{request.id}{request.sample ? ' · SAMPLE' : ''}</span><span class={'workspace-status status-' + request.status}>{statusLabels[request.status]}</span></span><strong>{request.title}</strong><span class="workspace-request-bottom"><span>{request.department} · {request.lines.reduce((sum, l) => sum + l.quantity, 0)} units</span><span>{money(requestTotal(request))}{!hasEstimates(request) ? ' + unpriced items' : ''}</span></span></button></li>{/each}</ul>{/if}
   </section>
   <section class="workspace-card workspace-detail" aria-labelledby="request-detail-heading">
    {#if selected}<div class="workspace-card-heading"><div><p class="eyebrow">{selected.id}{selected.sample ? ' · Fictional sample' : ''}</p><h2 id="request-detail-heading">{selected.title}</h2></div><span class={'workspace-status status-' + selected.status}>{statusLabels[selected.status]}</span></div><dl class="workspace-request-facts"><div><dt>Department</dt><dd>{selected.department}</dd></div><div><dt>Reviewer label</dt><dd>{selected.reviewer}</dd></div><div><dt>Needed by</dt><dd>{selected.neededBy || 'To be confirmed'}</dd></div><div><dt>Delivery locations</dt><dd>{selected.locations}</dd></div></dl>
     <ul class="workspace-detail-lines">{#each selected.lines as line, i (i)}<li><div><strong>{line.name}</strong><span>{line.quantity} units · {line.estimate === null ? 'Quotation needed' : money(line.estimate) + ' estimated each'}</span></div><strong>{line.estimate === null ? '—' : money(line.quantity * line.estimate)}</strong></li>{/each}</ul><div class="workspace-total"><span>Planning estimate{!hasEstimates(selected) ? ' · incomplete' : ''}</span><strong>{money(requestTotal(selected))}</strong></div><p class="workspace-cost-note">Estimates are for planning. Supplier pricing and all additional charges need confirmation.</p>{#if selected.notes}<div class="workspace-requirements"><h3>Branding &amp; notes</h3><p>{selected.notes}</p></div>{/if}
     {#if role === 'requester' && ['draft', 'changes_requested'].includes(selected.status)}<button type="button" class="button button-outline" onclick={() => { void openEditor(selected); }}>Edit request <Icon name="pen" size={16} /></button>{/if}
     {#if role === 'reviewer' && selected.status === 'pending'}<div class="workspace-review"><h3>Record a review decision</h3><p>This updates the local plan only. Both views use the same browser data.</p>{#if !hasEstimates(selected)}<p class="workspace-review-warning">Some items need estimates before approval.</p>{:else if approved + requestTotal(selected) > workspace.budget}<p class="workspace-review-warning">This request exceeds the remaining planning budget.</p>{/if}<label for="review-note">Review note <span>(required when requesting changes)</span></label><textarea id="review-note" maxlength="1000" rows="3" bind:value={reviewNote} placeholder="Explain your decision or changes needed"></textarea><div><button type="button" class="button button-outline" onclick={() => decide('changes')}>Request changes</button><button type="button" class="button" disabled={!hasEstimates(selected) || approved + requestTotal(selected) > workspace.budget} onclick={() => decide('approve')}>Record approval</button></div></div>{:else if role === 'requester' && selected.status === 'pending'}<p class="workspace-waiting">Awaiting local review. Switch to Reviewer view to try a decision.</p>{/if}
     {#if selected.status === 'approved'}<div class="workspace-progress"><h3>Fulfilment notes</h3><p>Manually record confirmed updates from your supplier. This is not live delivery tracking.</p><ol>{#each fulfilmentStages as stage, i (stage)}<li class:complete={i <= selected.stage}><span>{i < selected.stage ? '✓' : i + 1}</span>{stage}</li>{/each}</ol>{#if role === 'reviewer' && selected.stage < fulfilmentStages.length - 1}<label for="progress-note">Supplier update or reference</label><textarea id="progress-note" rows="2" maxlength="1000" bind:value={progressNote} placeholder="Record the confirmation you received"></textarea><button type="button" class="button button-outline" onclick={() => { act(() => advanceFulfilment(workspace, selectedId, progressNote), 'Manual progress update recorded.'); progressNote = ''; }}>Record: {fulfilmentStages[selected.stage + 1]}</button>{/if}</div>{/if}
     <div class="workspace-activity"><h3>Activity history</h3><ol>{#each [...selected.history].reverse() as entry, i (i)}<li><span class="workspace-activity-dot"></span><div><strong>{entry.action}</strong>{#if entry.note}<p>{entry.note}</p>{/if}<time datetime={entry.at}>{date(entry.at)}</time></div></li>{/each}</ol></div>
     <div class="workspace-share"><a class="button button-outline" href={whatsappUrl(requestBrief(selected))} target="_blank" rel="external noopener noreferrer">Discuss this brief on WhatsApp ↗</a><p>Opens a prepared message for you to review and send. It is not a purchase order.</p></div>
    {:else}<div class="workspace-empty"><Icon name="grid" size={32} /><h2 id="request-detail-heading">A home for every detail.</h2><p>Select a request to see products, estimates, review notes and progress.</p><a class="text-link" href={resolve('/products')}>Explore gifting selections <Icon size={16} /></a></div>{/if}
   </section>
  </div>
  <div class="workspace-bottom-note"><Icon name="settings" size={20} /><p>Looking for a shared team workspace? <a href={resolve('/contact?interest=procurement#quote')}>Discuss your procurement requirements</a>. Shared accounts, access controls, automated notifications, invoicing and live tracking are not connected to this preview.</p></div>
 </div>
</div>
