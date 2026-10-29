# OfNeeds gift-card SEO — 29 October 2026

## Search intent

The main page targets branded searches such as **OfNeeds gift cards**, **OfNeeds giftcard** and **OfNeeds gift vouchers**, alongside relevant searches for corporate gift cards in India, bulk gift vouchers for employees and employee rewards. These are content targets, not measured rankings or search-volume claims.

Canonical publication URL: `https://www.ofneeds.com/gift-cards`.

## Implemented

- Title: **OfNeeds Gift Cards | Corporate Gift Vouchers in India**.
- Description: **Explore OfNeeds gift cards and corporate gift vouchers in India. Browse brands and INR values, plan employee rewards and request a bulk quotation.**
- A descriptive gift-card H1, branded introduction and a clearer home-page section linking to the catalogue.
- One shared SEO profile for title, description, keyword mapping, last-modified date, CollectionPage/Service data and seven visible FAQs. Keywords are retained for the project's content map; meta keywords are not treated as a Google ranking mechanism.
- A useful A–Z directory with all 314 distinct names rendered in the initial HTML. Its normal HTML links now open individual brand/product pages, making every listed name discoverable beyond the first 12 cards.
- ItemList structured data matching the directory, alongside existing organization, website and breadcrumb data. No fabricated selling prices, inventory, ratings or reviews.
- Indexable robots metadata, a clean canonical URL even when tracking parameters are present, and sitemap revision `2026-10-29`.
- Permanent 308 redirects from `/giftcard`, `/giftcards`, `/gift-card`, `/gift-vouchers` and `/corporate-gift-cards` to the canonical page. Alias URLs are not added to the sitemap as duplicate pages.
- Existing logos, quantities, denominations, filters and sourcing-enquiry qualifications remain available.

## Verification

`npm run check`: 0 errors/warnings. `npm test`: 35 passed. `npm run test:seo`: 40 SEO profiles passed, including new gift-card metadata, visible FAQ/schema parity, all 314 directory names in server-rendered HTML, alias redirects, clean campaign canonical and absence of invented Product/Offer/Review data. The audit also checks existing paused campaign files; no campaigns or tracking were enabled.

Production-build, smoke and live-browser results are retained in `docs/RESUME-AFTER-RESTART.md`.

## Publication and discovery

These edits are local project changes. No production deployment or Search Console submission was performed.

After publishing the reviewed build to the OfNeeds domain:

1. Confirm the canonical page returns HTTP 200 on the public domain and the five aliases return 308.
2. In the verified OfNeeds Google Search Console property, inspect `https://www.ofneeds.com/gift-cards`, check the live URL and request indexing.
3. Submit or verify `https://www.ofneeds.com/sitemap.xml` in that property.
4. Monitor indexing and real search queries/impressions over time. Do not promise a particular position for the broad search “giftcard” or instant inclusion.

Google determines indexing and ranking. Its [title guidance](https://developers.google.com/search/docs/appearance/title-link) covers useful descriptive titles and headings. Its [recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) says crawl requests do not guarantee inclusion or timing. FAQ structured data is included for consistency with the site's existing profiles and visible questions; no FAQ rich-result eligibility is promised.


## Individual brand/product pages

The owner's follow-up request is implemented with **312 canonical brand/product detail pages covering all 323 source listings and 314 displayed names**. Exact duplicate names are grouped, and equivalent punctuation in GIVA Gold Jewellery/Giva-Gold Jewellery and GIVA Silver Coin/Giva-Silver Coin resolves to the same page. Distinct programmes such as Amazon Pay and Amazon Shopping remain separate.

Examples: `/gift-cards/starbucks`, `/gift-cards/amazon-pay-e-gift-card`, `/gift-cards/amazon-shopping-voucher`, `/gift-cards/wildcraft`, `/gift-cards/william-penn`.

Each page contains its actual logo, listed INR denominations, browsing category, a functioning value/quantity quotation control, brand-specific titles/descriptions, Service/Brand metadata, visible denomination/quotation FAQs, related pages and Home → Gift Cards → Brand breadcrumbs. Pages do not invent brand histories, selling prices, stock, reviews, validity or reseller authorisation. Their purpose is to help a buyer compare and specify a real catalogue requirement.

Normal HTML links from card names and the complete brand directory lead to the same self-canonical URLs listed in the sitemap, with an updated date. Unknown brand URLs return 404/noindex. The shared data model and route template render actual per-brand content on the server; no JavaScript is required to read the facts or discover the links.

Source: `src/lib/gift-card-brands.ts`, `src/routes/gift-cards/[slug]/`, and `src/lib/components/GiftBrandEnquiry.svelte`. The shared `seoFor` resolver supports these dynamic profiles without adding duplicate marketing campaign rows.

Validation: 38 unit tests passed; Svelte/type checks found zero errors/warnings. `node tests/gift-card-brand-seo.mjs` checked every one of the 312 pages for metadata, canonical, sitemap inclusion, crawlable links, three-level breadcrumbs, actual logos, visible FAQ/schema parity, real enquiry handoff and invalid URL handling. The full-site smoke check passed across 363 pages with distinct titles/descriptions. The package-price regression check continues to protect physical products while allowing genuine gift-card face values such as ₹499.

These changes remain local. After publication, verify the public sitemap and request indexing for priority pages in the verified OfNeeds Search Console property. Brand-name visibility and position are determined by Google and are not guaranteed.
