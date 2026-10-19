# OfNeeds SEO and search marketing implementation

Implemented in the current project on 3 October 2026. Canonical domain: **https://www.ofneeds.com/**. Public reference: [OffiNeeds](https://www.offineeds.com/). Live tracking and ads are disabled at the owner's request.

## What changed

- Original, intent-specific titles, descriptions and keyword topic sets for all 24 public pages. Company-wide India terms belong on the homepage; Bangalore/Bengaluru and product terms belong on relevant service pages.
- Metadata resolves from one editable source: `src/lib/data/seo-pages.json`. Error pages continue to return their actual status with noindex rather than receiving normal page metadata.
- Canonicals retain the OfNeeds domain, remove tracking parameters and avoid trailing-slash duplicates. Existing Svelte redirects, crawlable server-rendered HTML and robots sitemap declaration are preserved.
- Open Graph and Twitter cards use page-specific product photography on service pages, with correct image dimensions and descriptive alternative text. Every page declares OfNeeds branding and Indian English social locale.
- Organization markup adds the supplied logo, Bengaluru locality, genuine service topics and both contact numbers. WebSite, WebPage, Service and BreadcrumbList entities link to the OfNeeds domain. No unverified offices, certificates, reviews, opening hours or stock claims are added.
- All 16 service landing pages now include visible buying FAQs about the relevant products, quotation inputs and delivery planning. Their FAQ markup matches the visible answers. FAQs help buyers; they are not presented as a promise of Google rich results.
- The homepage adds an occasion-based internal-link section for onboarding, employee appreciation, clients, events, festive gifts and custom kits. The custom-kit heading now names the service clearly.
- Sitemap last-modified dates reflect this actual metadata/content revision. Dates are not regenerated on every request. Unpublished brand and article detail pages remain excluded.
- Existing responsive images, three-second hero carousel, genuine testimonials, logos, phone numbers, enquiry routes and ₹599/₹1099 packages are preserved.

## Keyword coverage

Primary topics include corporate gifting company in India, corporate gifts Bangalore/Bengaluru, employee onboarding kits, custom branded apparel, bottles, notebooks, awards, bags, technology gifts, employee appreciation, client gifts, festive hampers, reusable gifts and custom corporate gift sets. See [the complete page map](../marketing/seo-keyword-map.csv).

Meta-keyword tags are included as an explicit record of the requested keyword sets. Google does not use them for indexing or ranking. The substantive implementation is original page content, relevant links, titles, descriptions, crawlability and accurate structured data. [Google supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags), [title guidance](https://developers.google.com/search/docs/appearance/title-link).

Generic competitor topic ideas are adapted to OfNeeds. Competitor-written paragraphs, company claims and proprietary product names are not republished. Observed competitor keywords are not evidence of actual rankings or private SEM campaigns. The prior research is preserved in [the review](OFFINEEDS-SEO-REVIEW.md).

## SEM prepared, not launched

The `marketing` folder contains an organic keyword map, a paused campaign plan, exact/phrase keywords, original responsive search ads, proposed negative keywords and sitelink/callout copy. See [marketing instructions](../marketing/README.md). No budgets, IDs, pixels, analytics scripts, conversion tags or advertising API calls are configured.

## Publication and off-site work

This change updates local project files and the development preview. It does not deploy to the production domain. At review time, the public OfNeeds homepage still displayed the old ₹499/₹999 packages. Deploy the verified project through its existing hosting workflow, then verify the production pages before requesting indexing or importing ads.

After deployment, an authorized owner can verify the OfNeeds property in Search Console and submit `https://www.ofneeds.com/sitemap.xml`. The existing optional `GOOGLE_SITE_VERIFICATION` field supports a real HTML verification token. Confirm HTTPS and the www/non-www redirect at the hosting layer; do not change this canonical domain casually. [Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Local visibility also depends on the real Google Business Profile, accurate business details and legitimate customer reviews. No business profile, directory listing or backlink campaign was created. Search rankings and ad costs cannot be inherited by changing a competitor's brand name.

Google removed FAQ rich results in May 2026; FAQ markup remains descriptive Schema.org information only. [Google Search documentation changelog](https://developers.google.com/search/updates).

## Verification

Run `npm run check`, `npm run build`, `node tests/site-smoke.mjs http://127.0.0.1:5174` and `node tests/seo-audit.mjs http://127.0.0.1:5174`. The SEO audit checks all page profiles, titles/descriptions, canonicals, one H1, keyword sets, social image URLs and dimensions, genuine contact schema, visible FAQ/schema parity, updated sitemap dates, error noindex behavior, and absence of tracking/ad scripts. It also checks the offline ad-copy limits, landing paths and paused statuses.

Completed verification: Svelte/TypeScript reported 0 errors and 0 warnings; the Amplify production build passed. HTTP checks passed on 24 public pages, 24 internal link targets, 27 visible image URLs and 24 JSON-LD documents. The dedicated SEO audit passed on 16 services, 48 visible FAQ answers, 13 correctly dimensioned social images, 104 paused keyword entries and 17 paused ads. Desktop (1440px) and mobile (390px) checks found no horizontal overflow; FAQ expansion works. Account import and production deployment were not performed.
