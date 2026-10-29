# India gift-card catalogue and enquiries

Updated 29 October 2026 at `/gift-cards`.

## Verified reference catalogue

Reference: https://giftcardxpert.com/site/gifts

The initial unfiltered page showed no results. Explicitly selecting India and All revealed the catalogue. All actual pagination links were followed in an anonymous public session with the India country filter, producing **323 listings across 81 pages**, with **314 distinct names** when compared without case sensitivity.

Nine names occur twice: Cinepolis, FirstCry, Health & Glow, Tasva, KALKI, Nautica, Giva-Gold Jewellery, Giva-Silver Coin and Giva-Silver Jewellery. Both source entries are retained separately, with listing numbers in the UI. This is a count of listings and distinct displayed names, not a claim of 314 separate companies.

`src/lib/data/gift-card-catalogue.json` retains all 323 source IDs, names and listed denominations. `docs/gift-card-reference-audit.json` records the 81 URLs, counts and names, plus country, date and completion status. No competitor descriptions, terms, contact details or redemption links were copied. At the user's request, each card now displays its referenced brand logo, served as a local static asset. Brand names and the OfNeeds enquiry flow are retained.

## Implemented behaviour

- India/INR catalogue with brand/category search, nine OfNeeds browsing groups, A–Z/Z–A and starting-face-value sorting.
- Pagination with 12, 24 or 48 cards per page, first/previous/next/last controls and accurate filtered result counts. The default is 27 pages, with 11 cards on the last page.
- Every listing has its exact referenced INR denomination choices and a quantity input from 1–10,000. Values such as Elver ₹50 and Gaana ₹99 are retained. Starting face values and totals are not offered selling prices.
- Add up to five options to one brief. Brand selections use their listed denominations. Existing five generic category preferences remain available under the custom request control, and existing saved briefs remain readable.
- The brief retains occasion, independent quantities, selected face values and optional brand text for custom requests. A total shows requested face value only, excluding fees/taxes.
- Session storage uses `ofneeds-gift-brief-v1`; no contact details, recipient lists or voucher codes are stored there. Invalid/unknown entries, unsupported denominations, duplicates and briefs over five lines are rejected. Storage failure is disclosed.
- Continue transfers bounded editable requirement text and aggregate voucher quantity to the existing contact form. A mixed-value brief leaves per-recipient budget blank. Physical-product selections remain separate and can accompany the enquiry.
- The existing contact flow prepares a WhatsApp message to review/send, or uses the optional receiver when configured. Preparing a brief does not report delivery.
- Home, navigation, footer, canonical metadata and sitemap retain the gift-card entry.

OfNeeds confirms brand sourcing, commercial pricing, validity, redemption restrictions and delivery before an order. This source snapshot does not establish OfNeeds stock or an authorised reseller relationship. Purchase, payment, issuance, redemption and automatic recipient distribution are not connected.

## Source files

- `src/lib/gift-card-catalogue.ts`: catalogue mapping, OfNeeds browsing groups, filtering and sorting.
- `src/lib/gift-cards.ts`: backward-compatible brief model, denomination validation, session restore and contact transfer.
- `src/lib/components/GiftCardTile.svelte`: per-listing values and quantities.
- `src/routes/gift-cards/`: browsing, pagination, brief builder and responsive CSS.
- `tests/gift-cards.test.mjs`: source counts, uniqueness, search/filter/sort, denomination bounds, storage, five-option limit and handoff.
- `tests/gift-cards-browser.mjs`: updated browser regression scenario for the expanded catalogue.

The Svelte MCP autofixer described by AGENTS.md remains unavailable; compiler and svelte-check are used instead. Verification results for this update are recorded in the resume checkpoint. No real messages or orders were submitted.

## Brand-logo update

All 323 listings have a logo mapping, backed by 303 distinct image files in `static/gift-card-logos/` (about 2 MB). Duplicate listings share identical images. Assets keep their original bytes and formats and use content-hashed filenames, with width/height metadata and `logoSource` provenance in the catalogue JSON.

Logo sources were read from the audited reference pages. Two replacements are recorded in `docs/gift-card-logo-overrides.json`: Innovist's reference image was empty, so its official website logo is used; the first Domino's image returned HTTP 500, so the working logo from the other Domino's reference listing is used.

Cards have a white logo area with contained images, avoiding clipping or stretching. White transparent logos use a contrasting dark background. Layout is four cards across at desktop widths of at least 1200px, three at intermediate widths, two below 760px and one below 480px. Lazy loading, asynchronous decoding, image alt text, fixed logo-area height and a text fallback are included. Denominations, quantities, searches, filters, pagination and enquiry behaviour remain available.

`sync-gift-card-logos.py` reads only the audited public pages and verified asset hosts. Run from the project root using Python with Pillow: `python scripts/sync-gift-card-logos.py`, then `python scripts/sync-gift-card-logos.py --download`. Inspect replacements if an upstream asset changes. Assets are included with the source for ordinary builds; runtime downloads are not required.

Verification: Svelte/type check passed with zero errors/warnings; 35 unit tests passed, including local asset existence, dimensions, content-hash filenames and contrasting Innovist background. Browser and production verification are recorded in the resume checkpoint.

Final logo verification: production build and 51-route/64-image smoke checks passed. Live browser checks confirmed the four-column desktop grid at 1440px, the single-column layout at 375px without horizontal overflow, contained W/Wildcraft/William Penn logo images and visible white Innovist artwork. Screenshots are retained under `output/gift-cards/logos-*.png`. The user's normal browser viewport was restored.
