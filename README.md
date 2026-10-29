# OfNeeds corporate gifting website

Svelte 5 + SvelteKit 2, TypeScript, Vite and Tailwind. The existing Amplify adapter and deployment configuration are retained. Work is local; no production deployment is made by these commands.

## Install and run (Windows PowerShell)

Tested with Node.js 24.13.0 and npm 11.6.2. Bun was not installed on this computer, so the included npm lockfile is the tested installation path.

```powershell
git clone https://github.com/girishnshetty/Ofneeds-website-new-.git
cd Ofneeds-website-new-
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

For the existing local preview checkout, run the same npm commands from `ofneeds-source-preview` without cloning again.

Open http://127.0.0.1:5174/. Stop a foreground server with Ctrl+C.

## Buyer workspace and enquiry journeys

Open `/workspace` for the browser-based procurement planner. Create a request from the website's quote shortlist or add custom items, enter estimates and locations, save a draft and request local review. The Requester/Reviewer switch previews both sides of the flow. Reviewer decisions require complete item estimates and enough remaining planning budget. Changes can be requested with a note, revised and resubmitted. Approved requests support sequential, manually confirmed fulfilment notes. Search, status filters, activity history and CSV export are included.

Records use `localStorage` under `ofneeds-procurement-v1`; website shortlists still use their existing tab/session storage. Sample requests load only when explicitly chosen in an empty workspace. Sample amounts and progress are fictional. No order, payment, reviewer notification or supplier instruction is created by the planner. It has no shared accounts, authenticated approver permissions, durable server database, live shipping feed or invoicing service. `/workspace` is excluded from the sitemap and marked `noindex`.

The homepage includes an original workspace introduction and gift-card sourcing enquiry. No brand count, instant issuance or voucher availability is asserted. The enquiry component now distinguishes buyers, suppliers/brands and other enquiries. The audience is validated server-side and included in the optional receiver payload as `enquiryType`; supplier/other enquiries may have `quantity: null`. The existing Tally path remains available for buyer enquiries. With the direct receiver unconfigured, the brief builder prepares a WhatsApp message for the visitor to review and send.

Validation:

```powershell
npm.cmd run check
npm.cmd test
node tests/site-smoke.mjs http://127.0.0.1:5174
node tests/enquiry-audiences-integration.mjs
```

`tests/enquiry-audiences-integration.mjs` starts an isolated local dev server on 5181 and a local receiver; it never uses the production lead receiver. The local browser QA script `tests/workspace-browser.mjs` uses this workstation's bundled Playwright and installed Chrome; adjust those paths on other machines. It exercises request review, budget enforcement, persistence, responsive layouts, export and audience-specific briefs without sending any external messages. See `docs/DEALBERG-FEATURE-REVIEW.md` for scope and limitations.

## Build and test

```powershell
npm.cmd run check
npm.cmd test
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 5175 --strictPort
```

With that production preview running, use another terminal:

```powershell
npm.cmd run test:smoke -- http://127.0.0.1:5175
npm.cmd run test:seo -- http://127.0.0.1:5175
npm.cmd run test:integration
npm.cmd run audit:catalogues
```

The integration suite starts a separate preview on port 5180 and a local mock receiver. It never sends real business enquiries. The smoke and SEO suites are read-only HTTP checks. Temporary test modules are generated under ignored `.tmp/`.

## Enquiry channels

- The existing Tally form remains available at https://tally.so/r/OD0ZV7.
- The brief builder prepares a URL-encoded WhatsApp message; the customer must choose to open and send it. It never reports that a prepared message was delivered.
- Product IDs and per-product quantities are retained in the browser tab's session storage. Contact details are not written to that storage. Storage failure is disclosed in the UI.
- An optional existing server action sends leads to a configured HTTPS receiver. Copy `.env.example` to `.env` and supply `LEAD_WEBHOOK_URL` and, where needed, `LEAD_WEBHOOK_TOKEN` locally. No credentials are included. Successful HTTP acceptance is required before acknowledging an enquiry.
- The receiver must route notifications to the approved OfNeeds inbox, validate its own delivery semantics and honor `Idempotency-Key`. In-process duplicate protection and rate limiting are bounded safeguards; production scaling requires shared durable equivalents. A failed or ambiguous upstream response never produces a success message.
- Tally field mapping and inbox delivery require an owner check. The selected-product summary is available to copy into Tally's requirements field; arbitrary query parameters are not claimed to populate an unconfigured form field.

## Maintain content

- `src/lib/data/product-types.ts`: product-type selections and optional verified specifications/gallery fields.
- `src/lib/data/products.ts`: package prices and budget classification. Only the two user-confirmed advertised kit prices (₹599/₹1,099, updated 20 October 2026) are used. No live stock, individual-model prices or MOQs are inferred.
- `src/lib/data/categories.ts`: existing category links; `catalog.ts` retains category landing content and compatibility exports.
- `src/lib/data/catalogues.json`: untouched supplier source manifest. The audit generates `catalogue-review.json` and `docs/CATALOGUE-REVIEW.md`; all 97 source IDs are retained.
- `src/lib/data/brand-references.json`: names and categories supported by retained source IDs, without authorization claims. Update these references when the catalogue manifest changes.
- `src/lib/data/editorial.ts`: only owner-approved published articles, case studies and verified brand records belong here.
- `docs/insights-drafts.json`: eight substantive unpublished guides, with summaries, categories, image references and related products. Review business claims, authorship, imagery rights and publication dates before moving a guide into the public article array.

Existing category URLs, redirects, robots.txt, canonical URLs and contact details are retained. New discovery URLs are `/products` and `/products/[slug]`. No upload or public administrative dashboard is introduced.

See `docs/INITIAL-AUDIT.md`, `docs/IMPLEMENTATION-REPORT.md` and `docs/CATALOGUE-REVIEW.md` for implementation scope, evidence and remaining business inputs. Validation logs and screenshots are retained locally under `output/validation/`.

## Quality follow-up

The measured mobile lab results and their limits are in [docs/QUALITY-REPORT.md](docs/QUALITY-REPORT.md). Business inputs for real photography, product specifications, case studies and enquiry receipt are listed in [docs/CONTENT-INTAKE.md](docs/CONTENT-INTAKE.md).

The existing Tally form loads when a visitor chooses **Start enquiry**. One owner-approved test was accepted by Tally and confirmed received in the enquiry inbox on 20 October 2026; see `docs/enquiry-verification.json`. The optional direct webhook remains unconfigured because the owner selected the existing Tally channel.

Three customer stories reuse exact published feedback from AntStack, Infor and Amazon Bazaar. Their quotes appear once on the homepage; the clients page retains all seven distinct reviews. These are attributed customer experiences, without invented project photos, timelines, locations or model specifications.

Responsive derivatives are committed, so normal builds need no image tooling. To regenerate after editing `docs/photography-sources.json`, install Sharp separately and run from the project directory:

```powershell
npm.cmd install --prefix .tmp/media-tools --no-audit --no-fund sharp
node scripts/optimize-media.mjs .tmp/media-tools/node_modules/sharp
npm.cmd test
```

Original assets are retained. New `/media/` URLs are content hashed; keep the generated manifest and media files together. `customHttp.yml` prepares their Amplify cache headers; validate actual headers after deployment and merge any existing console configuration.

## Gift-card enquiries — India

Visit `/gift-cards` to browse all 323 reference gift-card listings (314 distinct names) with brand search, category filters, sorting and pagination, and build a bulk sourcing brief. Buyers can choose listed INR denominations, quantities and an occasion for up to five options, then continue to the existing contact form. Custom brand preferences remain available. All 323 listings include locally served brand logos, with a four-column desktop layout and responsive cards. The tab's session storage retains the brief separately from the physical-product shortlist.

Brand availability and terms require confirmation. This is an enquiry flow; payment, voucher issuance and redemption are not connected. See [docs/GIFT-CARDS.md](docs/GIFT-CARDS.md) for scope, source and validation.

Run `node tests/gift-cards-browser.mjs` against a running local preview at `http://127.0.0.1:5174/` for the browser flow. It uses the bundled Playwright runtime and installed Windows Chrome, prepares a WhatsApp draft and never sends it.


Gift-card brand SEO pages are available at `/gift-cards/[slug]` (for example `/gift-cards/starbucks`). All 323 listings map to 312 canonical brand/product pages, with source logos, denominations, quotation controls, unique SEO data and sitemap links. The A–Z directory and card headings provide ordinary crawlable links. Run `node tests/gift-card-brand-seo.mjs` against the local preview to check every new page. See `docs/GIFT-CARD-SEO.md` for publication/indexing steps.

The corporate gifting SEO brief is implemented across the existing homepage and 30 service/product landing pages, with a grouped buying directory and 511 requested keyword assignments. See [the architecture review](docs/SEO-ARCHITECTURE-2026-10-29.md) and `marketing/seo-architecture-2026-10-29.csv` / `.json` for URLs, metadata, content and FAQ data. Changes remain local until published to the existing production domain.
