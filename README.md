# OfNeeds corporate gifting website

Svelte 5 + SvelteKit 2, TypeScript, Vite and Tailwind. The existing Amplify adapter and deployment configuration are retained. Work is local; no production deployment is made by these commands.

## Install and run (Windows PowerShell)

Tested with Node.js 24.13.0 and npm 11.6.2. Bun was not installed on this computer, so the included npm lockfile is the tested installation path.

```powershell
cd 'C:\Users\GirisH\OneDrive\Documents\ChatGPT\ofneeds-b2b\ofneeds-source-preview'
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

Open http://127.0.0.1:5174/. Stop a foreground server with Ctrl+C.

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
- `src/lib/data/products.ts`: package prices and budget classification. Only the two user-confirmed advertised kit prices (₹499/₹999) are used. No live stock, individual-model prices or MOQs are inferred.
- `src/lib/data/categories.ts`: existing category links; `catalog.ts` retains category landing content and compatibility exports.
- `src/lib/data/catalogues.json`: untouched supplier source manifest. The audit generates `catalogue-review.json` and `docs/CATALOGUE-REVIEW.md`; all 97 source IDs are retained.
- `src/lib/data/brand-references.json`: names and categories supported by retained source IDs, without authorization claims. Update these references when the catalogue manifest changes.
- `src/lib/data/editorial.ts`: only owner-approved published articles, case studies and verified brand records belong here.
- `docs/insights-drafts.json`: eight substantive unpublished guides, with summaries, categories, image references and related products. Review business claims, authorship, imagery rights and publication dates before moving a guide into the public article array.

Existing category URLs, redirects, robots.txt, canonical URLs and contact details are retained. New discovery URLs are `/products` and `/products/[slug]`. No upload or public administrative dashboard is introduced.

See `docs/INITIAL-AUDIT.md`, `docs/IMPLEMENTATION-REPORT.md` and `docs/CATALOGUE-REVIEW.md` for implementation scope, evidence and remaining business inputs. Validation logs and screenshots are retained locally under `output/validation/`.
