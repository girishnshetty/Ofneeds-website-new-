# DealBerg reference review and OfNeeds implementation

Reviewed 29 October 2026. Reference: [DealBerg homepage](https://www.dealberg.com/). User selected both customer-facing features and the buyer dashboard. Implementation is local in this checkout; nothing has been deployed or pushed.

## Reference findings

DealBerg publicly presents an enterprise procurement journey, curated catalogues, purchase requests with approver review, digital rewards, logistics coordination and audience-specific enquiries. Its commercial scale, customer testimonials, voucher inventory, cost-saving claims and operational integrations are specific to that business. They have not been transferred to OfNeeds.

OfNeeds already had product discovery, category/budget filters, a quote shortlist, catalogues, FAQs, customer feedback, Tally and WhatsApp enquiry paths. The useful gaps were a connected planning workspace, explicit buyer/supplier enquiry routing and a digital-gifting enquiry entry point.

## Implemented

| Area | OfNeeds behaviour | Boundary |
| --- | --- | --- |
| Customer-facing introduction | Original responsive workspace and digital-gifting sections using OfNeeds styling, content and CSS illustrations | No DealBerg assets, testimonials, brand inventory or scale claims copied |
| Navigation | Header/footer workspace links, how-it-works anchor and quote-shortlist link to workspace | Existing product/category/contact routes retained |
| Purchase requests | Create draft or submit for local review, product shortlist import, custom lines, quantities, optional estimates, department, reviewer label, locations, requested date and branding notes | Local browser records; not purchase orders |
| Planning budget | Remaining allocation and pending/approved estimates; over-budget approvals blocked | Not real spend, a credit facility or a final supplier quote |
| Review | Requester/reviewer previews, approval records, changes with required reason, revision/resubmission and activity history | Role switch does not authenticate users or provide business access controls |
| Fulfilment notes | Sequential sourcing/artwork/production/dispatch/delivery stages requiring a manual confirmation note | No carrier API, live shipment or automatic state progression |
| Persistence and export | Versioned browser storage, validation of restored records, storage-failure feedback, formula-safe CSV export | Records are not shared across devices; clearing browser storage removes them |
| Sample workspace | Explicit opt-in from an empty workspace; all samples labelled fictional | Samples do not represent actual customers, prices, approvals or orders |
| Enquiry routing | Buyer, supplier/brand and other audiences; matching form fields and brief copy; server validation and receiver payload preserve audience | A supplier introduction does not approve/register a supplier |
| Digital gifting | Gift-card enquiry prefilled with brand, value and delivery questions | Availability, denominations and terms require team confirmation; no issuance/distribution API |

## Verification

- `npm.cmd run check`: zero errors and zero warnings.
- `npm.cmd test`: 25 passing tests, including approval budgets, unknown estimates, revisions, state transitions, invalid stored data and CSV formula protection.
- `node tests/site-smoke.mjs http://127.0.0.1:5174`: 50 sitemap routes, 50 internal links, 52 images and structured data checks passed. The noindex workspace is reachable through internal links but intentionally absent from the sitemap.
- `node tests/enquiry-audiences-integration.mjs`: all three audience types reach a local mock receiver; null supplier quantity, duplicate suppression and invalid-form rejection verified.
- `node tests/workspace-browser.mjs`: Chromium/Chrome tests passed for create, reload, change request, revise, approve, budget guard, manual progress, export, filtering, gift-card entry and audience switching. A separate browser context verified that the quote-shortlist link imports independent product quantities and the existing advertised kit estimate into the request editor. Homepage, workspace and request editor checked at 320, 375, 768 and 1440 pixels with no horizontal page overflow or JavaScript errors.
- Screenshots visually inspected: `output/dealberg-review/workspace-desktop.png`, `workspace-mobile.png`, `customer-features.png`, `customer-features-mobile.png`.
- `git diff --check`: passed.

The configured Svelte MCP documentation/autofixer tools were not available in this session. Official Svelte documentation, Svelte compiler/type diagnostics and browser checks were used instead. The computer-use browser kernel also failed to initialise; local Playwright/Chrome provided visual and functional verification.

A production build was not run for this update because the system disk had less than 25 MB free during verification. The existing matching dependency installation is reused through a `node_modules` junction. Static assets, package dependencies and deployment adapter were not changed. Production build and deployment validation remain necessary after adequate disk space is available.

## Services needed for a shared production workspace

The current workspace deliberately operates as a local planning preview. A shared production implementation needs authenticated company membership and server-enforced requester/approver permissions, durable request/budget transactions, supplier/quotation records, notification delivery and audit retention. Carrier tracking, GST invoices, payment/credit handling and gift-voucher sourcing/issuance need the relevant provider integrations and business terms. These services are not represented as connected or operational in the UI.
