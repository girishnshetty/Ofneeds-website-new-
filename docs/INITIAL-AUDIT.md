# OfNeeds improvement audit — 19 October 2026

Scope: the supplied ZIP in `ofneeds-source-preview`, running locally on port 5174. Production was inspected read-only at https://www.ofneeds.com/. Changes stay local.

## Architecture and baseline

- Svelte 5 / SvelteKit 2, TypeScript, Vite 8, Tailwind 4 plus shared CSS tokens. Amplify adapter and deployment configuration retained.
- Server-rendered category/content routes, optional server-only lead webhook, existing Tally enquiry and WhatsApp fallback. No authenticated administration, database, email provider, stock integration or secure upload storage is configured.
- Baseline: `npm run check` passes with zero errors/warnings; the existing HTTP smoke suite passes 39 routes, 39 internal links and 109 images. These checks do not establish external Drive permissions, accessibility conformance or Lighthouse scores.

| Severity | Confirmed issue / scope | Planned correction | Expected benefit |
| --- | --- | --- | --- |
| High | Eight product-type entries link to category pages; no discovery filters, item details or quote basket | Maintain honest product-type records, search/category filters, detail pages and persistent quantity shortlist | Buyers can assemble a clear multi-item brief |
| High | Direct lead submission lacks bounded rate limiting and idempotency | Reuse the action/webhook; validate product IDs/quantities; add bounded in-process controls and upstream idempotency key | Fewer accidental duplicates and abusive submissions |
| High | ZIP kit prices ₹599/₹1,099 differ from the user's brief and current live site ₹499/₹999 | Use user-confirmed advertised prices consistently, retaining tax/branding/shipping caveats | Avoid conflicting advertised prices |
| Medium | Repeated testimonial markup plus identical wording attributed to two clients | Render one instance per distinct quote; retain source data | Readable, credible customer proof |
| Medium | Animated client/occasion strips repeat content and increase visual noise | Static responsive layouts; preserve authorized existing logos and links | Clearer scanning, less motion |
| Medium | Floating WhatsApp text button covers the secondary hero CTA in the narrow preview | Icon-only control with reserved mobile space; hide while editing forms | Controls remain accessible |
| Medium | 97 catalogue records: 90 marked downloadable; seven zero-byte at the historical 5 October check | Default to downloadable records; retain request-a-copy view and audit record | Avoid misleading download actions |
| Medium | Five probable duplicate catalogue pairs have equal size and byte-identical cover images, but full file equality is unverified | Flag possible editions in review; retain originals and distinguish source filenames | No unsupported choice of latest edition |
| Medium | Six available catalogues lack covers and range from 58.9 to 166.4 MB | Honest cover fallback, file-size warnings, sorting and progressive rendering | Predictable browsing/downloads |
| Medium | Catalogue empty-state reset leaves category selected | Reset all filters; add status/sort controls | Easier recovery from empty results |
| Medium | Brands, articles and case studies arrays are empty | Searchable catalogue brand references with explicit provenance; unpublished editorial drafts; reusable case-study model | Useful discovery without invented sourcing relationships or projects |
| Medium | Custom form collects only one free-text product requirement | Integrate shortlist, per-item quantities, branding and delivery into existing flow; retain Tally | Lower enquiry friction without mock submission |
| Low | Full local font is used only for the hero tagline; several imported components are unused | Use system typography, remove unused imports; retain source assets | Smaller initial transfer and simpler maintenance |

## Data and external limits

Catalogue counts are derived from the retained source manifest; local covers exist for all 84 referenced images. No duplicate Drive IDs or exact source filenames were found. Remote download permission and freshness are unverified today. No supplier files will be deleted. Brands mentioned in catalogue titles do not establish authorization or live stock. Exact models, MOQs, materials, stock, authorized relationships, completed-order photographs and publication permission need owner evidence. Analytics events will only forward through an existing consented provider, if one exists; no duplicate tracking service will be installed.

## Validation plan

Run type/build checks and existing suites; add tests for shortlist normalization, quotation serialization, idempotency/rate limiting and catalogue classification. Exercise product discovery, basket persistence, form errors, menus, contact links and responsive widths 320/375/390/768/1024/1440 in the browser. Record measurements actually obtained. Keep external submissions confined to a local mock receiver. Document unmeasured Lighthouse/Web Vitals rather than inventing scores.
