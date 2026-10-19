# OfNeeds owner setup

The website runs without new environment variables. The existing Tally enquiry form remains the default lead channel. The detailed brief builder prepares a WhatsApp enquiry and clearly states that the brief has not been submitted.

## Direct quotation submissions

Configure `LEAD_WEBHOOK_URL` only when an approved lead receiver is ready. The URL must use HTTPS in production. Local HTTP endpoints are accepted only for development. Set `LEAD_WEBHOOK_TOKEN` if your receiver requires a bearer token. Neither value is included in browser code. Do not prefix secrets with `PUBLIC_`.

The receiver gets a JSON POST with `leadId`, `createdAt`, `name`, `company`, `email`, `phone`, `productRequirement`, numeric `quantity`, numeric or null `budget`, `deliveryDate`, `deliveryCity`, `notes`, `source` and `status: "new"`. The status type also supports contacted, qualified, quotation_requested, quotation_sent, follow_up, won and lost.

The receiver must acknowledge with HTTP 2xx only after it durably accepts the lead. Use `leadId` for idempotency, and configure receiver-side rate limits and retention. The site times out after ten seconds, rejects redirects and shows an honest failure with alternative contact channels when delivery fails. It does not store leads on an ephemeral web-server filesystem.

Configure these variables in the actual SSR server runtime. Verify the runtime configuration on an Amplify staging deployment; build-time console variables alone must not be assumed to reach server code. The existing `amplify.yml`, Svelte adapter configuration, package manifest and Bun lockfile have been preserved. Keep Tally available while confirming the receiver, notifications and actual lead storage. Logo/file uploads are deferred until approved storage exists; buyers can share artwork directly with the team.

## Google Search Console

1. Add `ofneeds.com` as a Domain property and complete the DNS verification that Google provides, or use the URL-prefix property `https://www.ofneeds.com/` with HTML tag verification.
2. For HTML tag verification, set `GOOGLE_SITE_VERIFICATION` to the real content value from Google's tag. The root Svelte layout renders it into the page head. Redeploy, inspect the live homepage source and complete verification in Search Console. This variable remains blank until you provide the token. [Google ownership verification instructions](https://support.google.com/webmasters/answer/9008080).
3. After publishing the approved site, open `https://www.ofneeds.com/sitemap.xml` and submit that sitemap in Search Console. The sitemap uses the production canonical host and includes only public pages and approved future content. [Google sitemap instructions](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
4. Inspect the homepage and important category URLs in Search Console. Confirm crawling, selected canonical URLs and indexing, then monitor performance and Core Web Vitals after real traffic is available.

Query strings are excluded from canonical URLs. SvelteKit redirects trailing slashes to the consistent route. Domain-level www/non-www and HTTPS redirects remain a hosting configuration responsibility; no DNS or domain configuration has been changed.

FAQPage JSON-LD matches the visible FAQs, but Google retired FAQ rich results in May 2026. Its presence is semantic markup, not a promise of a Google FAQ enhancement. [Google Search updates](https://developers.google.com/search/updates).

## Content to supply

- Verified supplier brands and product models. Client logos are not used as supplier brands.
- Genuine case-study details: project/client name, requirement, products, quantity, branding, timeline, delivery location, images and outcome, plus permission to publish them.
- Product photography for tech accessories, executive and festive gifts. Existing imagery is reused as illustrative merchandise, without implying new exact SKUs.
- Approved full privacy policy and complete order terms. Current pages provide factual enquiry-channel and ordering information; they do not invent retention periods, refund policies, payment schedules or contract terms.
- Confirmed minimum quantities, production timelines and direct-to-employee delivery arrangements to make FAQs more specific.
- Full business address, map link, hours and genuine social profiles if you want them published. The existing project only identifies Bengaluru, Karnataka, India.
- Confirm the original metrics archived in `docs/legacy-data.json` before republishing them.
- Owner-approved insights/articles. Editorial arrays are intentionally empty until quality content is ready.

## Adding brands, projects and insights

Use `src/lib/data/editorial.ts`. Typed records keep all required fields together. Only `verified: true` brands and `published: true` projects/articles are public. Unapproved brand and article slugs return a proper 404 and are excluded from the sitemap.

A configurable case-study record has this shape; the empty default arrays publish none of these placeholders:

```ts
{
  slug: 'replace-with-approved-project-slug',
  client: 'Replace with an approved name',
  requirement: 'Replace with the actual requirement',
  products: [], quantity: '', branding: '', timeline: '',
  deliveryLocation: '', images: [], outcome: '', published: false
}
```

Category copy, product links and related pages live in `src/lib/data/catalog.ts`. Business details, FAQs and process copy live in `src/lib/data/site.ts`. Original customer quotes, product descriptions and the two genuine package prices live in `src/lib/data/legacy.ts`. Change the reusable social image in `site.socialImage` and its dimensions in `Seo.svelte` if a new approved image replaces the current square product image.

## Local checks

Run from the project directory after installing its locked dependencies:

```powershell
bun run check
bun run build
node --test tests/lead-validation.test.mjs
node tests/lead-integration.mjs
node tests/site-smoke.mjs http://127.0.0.1:5174
```

The integration test starts a temporary production preview on port 5180 with a local mock receiver and closes both afterward. It never sends a business lead. The smoke test requires a running local preview; it verifies every public route, titles, descriptions, one H1, JSON-LD, internal links, images, anchors, canonical URLs, redirects, sitemap, robots and 404 behavior. Do not submit test enquiries to the production Tally form.

## SEO and search marketing update — 3 October 2026

Edit page metadata and keyword topics in src/lib/data/seo-pages.json. This also holds the visible service FAQs and the actual content revision dates used in the sitemap. Update a page's revision date when its content or metadata changes; do not refresh dates on every request.

See docs/SEO-SEM-IMPLEMENTATION.md for implementation and verification details. The marketing folder contains the organic keyword map and paused SEM drafts. Live tracking and ads are disabled at the owner's request; no budget or tracking ID is configured. Run node tests/seo-audit.mjs http://127.0.0.1:5174 against a local preview to validate metadata, visible FAQ/schema parity, social image dimensions and ad-copy constraints.
