# Photography sources

The website uses eleven stock photographs from Pexels and Unsplash, the original OfNeeds corporate welcome-kit image, the user-supplied personalized Custom Gift Sets image, and an event-merchandise reference photograph located through Google Images. The welcome-kit category, package section and matching landing pages share the business-owned kit image.

These are illustrative category and gifting photographs. They do not establish exact package contents, new supplier-brand relationships, product specifications, stock availability or endorsement. Existing prices and product descriptions are preserved.

Ten selected photographs are free to use under the [Pexels License](https://www.pexels.com/license/). The unbranded cap photograph is free to use under the [Unsplash License](https://unsplash.com/license). Attribution is optional under that license; the original source pages are recorded here for the owner. No paid or watermarked stock assets have been used.

The site serves local WebP variants at 480, 900 and 1440 pixels with responsive selection, reserved dimensions and lazy loading below the fold. The downloaded HD references are retained in the local staging folder, rather than adding large originals to production requests.

| Website image | Photographer | HD reference size | Source |
|---|---|---|---|
| welcome | OfNeeds original website asset | 1066 × 1066 | `static/hero.webp`; served using existing optimized hero variants |
| apparel | dayong tien | 1800 × 1199 | [Photo 34156906](https://www.pexels.com/photo/minimalist-flat-lay-of-cotton-t-shirts-34156906/) |
| drinkware | Tima Miroshnichenko | 2400 × 1600 | [Photo 7879967](https://www.pexels.com/photo/fresh-lemon-fruit-beside-a-stainless-jug-7879967/) |
| notebooks | PNW Production | 2400 × 3600 | [Photo 8489918](https://www.pexels.com/photo/a-journal-over-a-white-table-8489918/) |
| awards | Nataliya Vaitkevich | 2400 × 3600 | [Photo 6532364](https://www.pexels.com/photo/golden-trophies-on-the-table-6532364/) |
| backpacks | Matheus Bertelli | 2400 × 3600 | [Photo 18999333](https://www.pexels.com/photo/black-backpack-with-thermos-18999333/) |
| tech | See source page | 2400 × 3600 | [Photo 30345430](https://www.pexels.com/photo/office-desk-with-headphones-and-keyboard-30345430/) |
| executive | Philipp Pistis | 2400 × 1600 | [Photo 10963244](https://www.pexels.com/photo/close-up-shot-of-a-pen-and-a-notebook-on-a-wooden-table-10963244/) |
| caps | Mediamodifier | 2400 × 3193 | [White baseball cap](https://unsplash.com/photos/white-baseball-cap-on-white-surface-t8HiP3e5abg) |
| festive | See source page | 2400 × 2400 | [Photo 28769884](https://www.pexels.com/photo/elegant-diwali-gift-box-with-assorted-sweets-28769884/) |
| eco | fzaytt | 2400 × 3200 | [Photo 30382341](https://www.pexels.com/photo/canvas-tote-bag-with-books-and-dried-flowers-30382341/) |
| custom | User-supplied product image | 684 × 524 | Attached personalized black gift-kit photograph; served as `custom-provided-360.webp` and `custom-provided-684.webp` |
| jackets | Ali Babajahdi | 2400 × 3600 | [Photo 16341730](https://www.pexels.com/photo/jacket-on-hanger-16341730/) |

The stock photographs use 33 responsive WebP variants. The welcome-kit image reuses the three existing optimized hero variants. The supplied Custom Gift Sets photograph is served at 360 pixels or its native width, without enlarging it beyond the source resolution. Browsers choose a suitable variant for each image.

To replace a photograph later, update `src/lib/data/photography.ts` and the corresponding assets in `static/photography`. Keep the source record current.


## Event Merchandise reference update — 3 October 2026

The Event Merchandise category and its landing page now use the HD photo matching the owner's reference: colleagues handing over a coordinated branded merchandise box. The separate Caps product retains its cap photograph.

- Discovery: Google Images search for `monday merch event merchandise swag packs`.
- Original publisher: [Monday Merch — Event Merchandise & Swag Packs](https://www.mondaymerch.com/use-cases/events-and-exhibitions).
- Original asset: [1499 × 1000 JPEG](https://framerusercontent.com/images/ayHhPZmQxa95wF174fKqZ9GKlug.jpeg?height=1000&width=1499).
- Local responsive WebP variants: `events-480.webp` (480 × 320), `events-900.webp` (900 × 600), and `events-1440.webp` (1440 × 961).
- This third-party reference is illustrative and retains its original brand marks. It is not represented as OfNeeds-owned photography or as an OfNeeds customer project. Commercial reuse permission has not been verified; it is not included in the free-stock license statements above.

The image is served from the project's static assets rather than relying on the publisher's server for customer page views.
