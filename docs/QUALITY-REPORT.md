# OfNeeds quality follow-up — 20 October 2026

Measured against the local production build on `127.0.0.1:5175`, using Lighthouse 13.5.0, mobile emulation and simulated throttling. These are individual lab samples. They are not production/real-user measurements or a full WCAG conformance audit. Exact metrics, timestamps and warnings are in `quality-results.json`; the raw HTML/JSON reports remain locally in `output/validation/`.

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage, including customer stories | 91 | 100 | 100 | 100 | 2.4 s | 280 ms | 0 |
| Product detail: notebooks | 99 | 100 | 100 | 100 | 2.0 s | 60 ms | 0 |
| Catalogue library | 98 | 100 | 100 | 100 | 2.2 s | 10 ms | 0 |
| Contact, before opening Tally | 99 | 100 | 100 | 100 | 1.8 s | 20 ms | 0 |

The homepage and product samples included Lighthouse's slow-host CPU warning, retained in the JSON summary. Lab results vary: the original homepage sample scored 96 with LCP 2.2 s; a later sample scored 95 with LCP 2.7 s; the final sample, including three new customer stories, scored 91 with LCP 2.4 s. Image byte savings are established separately and are not presented as a guaranteed score increase. Validate performance on the production host. INP was not measured; TBT is not INP.

## Corrections verified

- Tally originally loaded on the contact page and fetched 32 external resources totalling 790,028 bytes in the recorded run. The contact performance score was 77 and LCP 5.9 s. It now loads after the visitor chooses **Start enquiry**, producing 99 and LCP 1.8 s in the final initial-load sample, with no external requests before activation. Choosing the button still displays the original live form and moves keyboard focus into the loaded frame. Once opened, the provider's speed and accessibility remain relevant and are not removed by this initial-load optimization.
- Product-card image links now include their visible selection/package label in the accessible name. The unweighted `label-content-name-mismatch` audit changed from failing to passing on pages containing product cards. Weighted accessibility scores alone did not reveal that issue.
- Failed brief validation now focuses a summary with links to invalid inputs. The phone error link focuses the phone input; correcting it produces the explicit unsent WhatsApp brief. Branding and notes errors also have associated field messages. That validation test sent no enquiry.
- Sixteen existing image references now have 91 responsive, content-hashed WebP variants, with intrinsic dimensions derived from the encoded assets. Comparing the same smallest existing width variants gives 424,166 → 284,332 bytes, a 33% reduction. Originals are retained. These remain existing illustrative/catalogue assets, not newly verified product photography.
- `customHttp.yml` prepares immutable caching only for `/media/*`, whose generated filenames contain a content hash. Effective CDN headers need verification after any future approved deployment; local preview does not prove hosting cache behavior. Preserve/merge any existing console-managed headers when deploying. [AWS custom-header documentation](https://docs.aws.amazon.com/amplify/latest/userguide/setting-custom-headers.html)

## Checks and remaining inputs

Svelte check: zero errors/warnings. Official local Svelte autofixer: no remaining issues/suggestions in the changed components. Unit suite: 16 passed, including responsive-media/hash integrity and source integrity for customer stories. The local mock lead receiver passed confirmed acceptance, selected-product quantities, branding, duplicate suppression, retry/failure handling, rate limit, body limits, honeypot, CSRF and headers. The HTTP smoke suite passed 50 pages, 50 internal links and 52 image sources. The SEO suite passed 39 pages and 76 visible FAQ comparisons. Browser layout was verified at actual widths 304 and 1265; attempted viewport overrides did not apply in this pass, so those attempts do not establish additional breakpoint coverage.

The owner selected the existing Tally form and explicitly approved one labelled test. Tally accepted `OFN-QA-20261020-01` and showed “Form submitted”; the owner then confirmed receipt in the enquiry inbox. See `enquiry-verification.json`. The test used OfNeeds' public business contacts and requested no quotation or callback. No customer enquiry or order was placed. No production deployment was performed.

Three customer-story cards now reuse exact existing feedback from AntStack, Infor and Amazon Bazaar. Only customer-reported details are summarized, with source attribution; these are not independently documented project case studies. Their quotes appear once on the homepage, and the clients page retains all seven distinct reviews. No project images, timelines, locations or model specifications were invented. Actual model-level specifications and fuller project evidence remain business inputs; product photography was deferred at the owner's request.
