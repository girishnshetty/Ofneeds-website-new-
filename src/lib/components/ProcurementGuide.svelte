<script lang="ts">
 import { resolve } from '$app/paths';
 const checks = [
  ['Product specification', 'Model, materials, dimensions, colour and any required certifications.', 'Equivalent specifications across quotations; confirm substitutions before approval.'],
  ['Quantity & branding', 'Units per item, apparel sizes, logo files, placement and personalization.', 'Minimum quantities, sample or artwork approval and branding setup charges.'],
  ['Complete landed cost', 'Product, branding, packing, applicable taxes and delivery.', 'The same inclusions and recipient count; distinguish estimates from confirmed quotations.'],
  ['Dispatch & delivery', 'Office or destination counts, packing lists and required arrival dates.', 'Production schedule, delivery coverage and the handling of split shipments.'],
  ['Order terms & ownership', 'Written commercial terms, internal approver and order contact.', 'Payment stages, replacement terms and the person responsible for resolving discrepancies.']
 ];
</script>
<section class="section section-muted" aria-labelledby="procurement-comparison-title"><div class="container">
 <div class="section-heading"><div><p class="eyebrow">A practical procurement checklist</p><h2 id="procurement-comparison-title">Compare the complete<br />corporate gifting quotation.</h2></div><p>Give HR, admin and procurement the same brief so product choices, costs and delivery decisions stay aligned.</p></div>
 <!-- svelte-ignore a11y_no_noninteractive_tabindex -- Focus lets keyboard users scroll the comparison table on narrow screens. -->
 <div class="procurement-table" tabindex="0" role="region" aria-label="Gifting quotation comparison checklist">
  <table><caption>What to request and compare before approving a corporate gift order</caption><thead><tr><th scope="col">Decision</th><th scope="col">Include in your brief</th><th scope="col">Compare before approval</th></tr></thead><tbody>{#each checks as [decision, brief, comparison] (decision)}<tr><th scope="row">{decision}</th><td>{brief}</td><td>{comparison}</td></tr>{/each}</tbody></table>
 </div>
 <div class="procurement-guide-next"><p>For recurring onboarding, recognition or remote-team gifting, keep separate quantities and required dates for each programme. Confirm availability and commercial terms with OfNeeds before ordering.</p><a class="button button-outline" href={resolve('/contact#quote')}>Share your buying brief</a></div>
</div></section>
<style>
 .procurement-table{overflow-x:auto;border:1px solid #dce2df;border-radius:12px;background:#fff}table{border-collapse:collapse;width:100%;text-align:left;font-size:14px;line-height:1.65}caption{text-align:left;padding:20px;font-weight:600}th,td{padding:18px 20px;border-top:1px solid #e4e9e4;vertical-align:top}thead{background:#eff3ed}th{font-weight:600}tbody th{width:21%}td{width:39.5%}.procurement-guide-next{display:flex;align-items:center;gap:32px;justify-content:space-between;margin-top:25px}.procurement-guide-next p{max-width:730px;line-height:1.7;font-size:14px}.button{flex-shrink:0}
 @media(max-width:760px){table{min-width:670px}.procurement-guide-next{align-items:start;flex-direction:column;gap:15px}}
</style>
