# OfNeeds corporate gifting SEO architecture

Implemented locally on 29 October 2026 from the supplied corporate gifting keyword brief. This extends the existing site; it does not create duplicate landing pages for alternative spellings or short URLs.

## Implemented

- Homepage title: **Corporate Gifting Company in Bangalore | Branded Merchandise | OfNeeds**. The H1 names corporate gifting, branded merchandise and Bangalore. Supporting headings cover employees, clients, events, welcome kits, apparel and bulk gifting across India.
- The existing **30 corporate gifting landing pages** cover the recommended product, audience, occasion and budget clusters. All 30 received a more specific second FAQ, matching the FAQ structured data, and a current sitemap revision date. Bengaluru and Bangalore are used naturally in the relevant content.
- `/corporate-gifts#gifting-directory` presents six groups with 30 ordinary HTML links: the other 29 landing pages and the gift-card catalogue. Homepage, footer and related-guide sections connect buyers to this hub.
- The HR/procurement page now includes a five-part quotation comparison table. On mobile its container scrolls independently and is keyboard focusable; the complete page does not overflow horizontally.
- Branded merchandise, procurement and corporate gift content has additional guidance on employee swag, startup/distributed teams, artwork, approvals and order specifications.
- Existing permanent aliases continue to point to their established canonical pages. Canonical URLs, sitemap URLs and internal links remain consistent. The previous 312 brand-specific gift-card pages remain available.

## Reviewable architecture and keyword assignments

- `marketing/seo-architecture-2026-10-29.csv`: 31 core URLs (homepage + 30 landing pages), primary and supporting keywords, page title, H1, meta description, FAQ count and aliases.
- `marketing/seo-architecture-2026-10-29.json`: the same architecture with introductions, content sections, checklists, related pages and the full FAQ content.
- `marketing/seo-request-keywords-2026-10-29.csv`: **511 distinct phrases** extracted from the supplied bullet lists and priority list, assigned to existing canonical pages. This is an editorial planning map, not a list inserted into every page or a claim of measured search demand. Manufacturing/distribution/wholesale claims require business verification. Local-area requests remain delivery enquiries rather than invented branch pages.
- `marketing/seo-keyword-map.csv`: existing full-site map updated to match the actual SEO profiles.

## Canonical URL decisions

| Requested short URL | Existing canonical destination |
| --- | --- |
| `/employee-gifting` | `/employee-gifts` |
| `/welcome-kits` | `/employee-welcome-kits-bangalore` |
| `/corporate-tshirts` | `/corporate-tshirts-bangalore` |
| `/corporate-jackets` | `/corporate-jackets-bangalore` |
| `/drinkware` | `/corporate-drinkware` |
| `/notebooks-diaries` | `/corporate-notebooks-diaries` |
| `/bags-backpacks` | `/corporate-backpacks` |
| `/tech-gifts` | `/tech-corporate-gifts` |
| `/trophies-awards` | `/corporate-trophies-awards` |
| `/client-gifting` | `/client-gifts` |
| `/eco-friendly-gifts` | `/eco-friendly-corporate-gifts` |

These aliases return 308 redirects and stay out of the sitemap. The remaining recommended URLs already have their own pages.

## Business facts and publication

Prices and minimum quantities are confirmed for the actual order. No under-budget product prices, stock, manufacturing status, reseller authorizations, certifications, branch offices or fixed delivery times were invented. Existing advertised welcome-kit package prices remain ₹599 and ₹1,099, with complete costs confirmed through quotation.

Changes are local, uncommitted and not deployed. After publication on the existing production domain, use the site's Search Console property to submit or refresh `https://www.ofneeds.com/sitemap.xml` and inspect representative URLs. Google Business Profile maintenance, genuine reviews, relevant links and verified business signals require separate account/business work. No advertising, analytics, new tracking or external communications were activated.

Google must discover and index the published pages; rankings, a first-page position and appearance for every broad keyword cannot be guaranteed. FAQ data describes visible content and is not a promise of a rich result.

References: [Google ecommerce site structure](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure), [URL design](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies).

## Validation

The SEO audit verifies all 40 static profiles, visible FAQ/schema parity, metadata/social images, sitemap revisions, canonical destinations for all supplied keywords, the complete server-rendered directory and every core landing-page alias. The full-site smoke test covers the 363 sitemap pages, including the existing gift-card brand pages. Unit tests cover the existing enquiry, shortlist, workspace and gift-card behavior.

The repository's preferred Bun executable and Svelte MCP/autofixer tools were unavailable. Existing npm scripts, the installed Svelte compiler, svelte-check and live browser checks were used; no new dependency was installed.

Final results: Svelte/type checks passed with 0 errors and 0 warnings; all 38 unit tests passed; the 40-profile SEO audit passed (31 services / 67 visible FAQ questions); the production build passed; the full 363-route smoke test passed (364 internal URLs, 355 image URLs, unique metadata on every page). Browser checks passed at 1440px and 375px, including directory navigation and keyboard scrolling of the procurement comparison. Screenshots are saved under output/seo/. Temporary viewport overrides were reset.
