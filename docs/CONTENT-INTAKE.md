# Remaining business inputs

The owner deferred product photos and selected the existing Tally form on 20 October 2026. The site supports specifications, model galleries and published customer projects. Three customer stories now summarize existing published feedback with verbatim quotes and source attribution. Missing model-level facts and fuller project evidence must still be supplied before those records can be completed. Existing illustrative imagery remains labelled; smaller responsive derivatives do not establish authenticity.

## Products

Provide a local folder or approved catalogue, and one record per actual model:

| Field | Required input |
| --- | --- |
| Identity | Product name, model/SKU and category |
| Photographs | Front, detail, branding and packaging photographs; permission to publish |
| Specifications | Material, dimensions/capacity, colours/sizes and branding methods |
| Order terms | MOQ, dated indicative price, what it includes and production lead time |
| Evidence | Supplier/source reference and business approver |

Existing selection IDs: `t-shirts`, `notebooks`, `caps`, `trophies`, `steel-sipper-bottle`, `jackets`, `reusable-tote-bag`, `backpacks`, `welcome-kit-1`, `welcome-kit-2`. Model-level information belongs in `src/lib/data/product-types.ts` or `products.ts`; galleries use the `Photography` shape in `photography.ts`. Keep illustration labels until actual photographs have been approved.

## Completed projects

Provide the client name (or an approved anonymized label), requirement, supplied products, quantity, branding, actual timeline, delivery location, outcome, photographs and permission to publish the client/project evidence. Add approved records to `caseStudies` in `src/lib/data/editorial.ts`. Set `published: true` only after review; the existing homepage component renders published records automatically. Do not infer completed projects from testimonials, logos or catalogue references.

## Enquiry delivery

The retained Tally form is `https://tally.so/r/OD0ZV7`. The direct receiver uses the server-only `LEAD_WEBHOOK_URL` and optional `LEAD_WEBHOOK_TOKEN` in `.env.example`. Configure the HTTPS receiver in the hosting environment, never in browser code. The receiver must validate the expected JSON, honor `Idempotency-Key`, accept enquiries durably and route them to the approved OfNeeds inbox.

The owner authorized one labelled test, `OFN-QA-20261020-01`. Tally displayed “Form submitted” and “Thanks for completing this form!”; the owner then confirmed receipt in the configured inbox. This verifies the selected Tally path for that test. The optional direct receiver has only local mock integration evidence and is not configured. No customer enquiry was sent and no order was placed.

Tally field mapping requires access to the form's field configuration. A public form URL does not grant permission to change its settings or prove receipt. Until configured, the website keeps the explicit copy-summary and WhatsApp review/send paths.
