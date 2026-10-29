<script lang="ts">
    import { page } from '$app/state';
    import { site } from '$lib/data/site';
    import { seoFor } from '$lib/data/seo-pages';
    import { canonical, jsonLdScript, organization, website, breadcrumbs, faqSchema, type Schema } from '$lib/seo';
    let { title, description, extra = [], crumb, trail, noindex = false, image }: {
        title: string; description: string; extra?: Schema[]; crumb?: string; noindex?: boolean;
        trail?: { name: string; path: string }[];
        image?: { src: string; srcset?: string; width: number; height: number; alt: string };
    } = $props();
    const profile = $derived(noindex ? undefined : seoFor(page.url.pathname));
    const resolvedTitle = $derived(profile?.title ?? title);
    const resolvedDescription = $derived(profile?.description ?? description);
    const url = $derived(canonical(page.url.pathname));
    const social = $derived.by(() => {
        if (!image) return { src: site.socialImage, width: 1066, height: 1066, alt: 'OfNeeds corporate employee welcome kit' };
        // Use the variant matching the declared dimensions, rather than a smaller fallback.
        const variant = image.srcset?.split(',').map((item) => item.trim().split(/\s+/))
            .find((item) => item[1] === `${image.width}w`);
        return { ...image, src: variant?.[0] ?? image.src };
    });
    const schemas = $derived([
        organization, website,
        { '@type': profile?.pageType ?? 'WebPage', '@id': url + '#webpage', url,
            name: resolvedTitle, description: resolvedDescription, inLanguage: 'en-IN',
            isPartOf: { '@id': site.origin + '/#website' },
            about: { '@id': site.origin + '/#organization' },
            ...(profile?.service ? { mainEntity: { '@id': url + '#service' } } : {}) },
        breadcrumbs(trail ?? (crumb ? [{ name: 'Home', path: '/' }, { name: crumb, path: page.url.pathname }] : [{ name: 'Home', path: '/' }])),
        ...(profile?.service ? [{ '@type': 'Service', '@id': url + '#service', name: profile.service,
            serviceType: profile.service, description: resolvedDescription, url,
            provider: { '@id': site.origin + '/#organization' },
            areaServed: { '@type': 'Country', name: 'India' },
            image: site.origin + social.src }] : []),
        ...(profile?.faqs ? [faqSchema(profile.faqs)] : []), ...extra
    ]);
</script>

<svelte:head>
    <title>{resolvedTitle}</title>
    <meta name="description" content={resolvedDescription} />
    {#if profile}<meta name="keywords" content={profile.keywords.join(', ')} />{/if}
    <link rel="canonical" href={url} />
    <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:site_name" content={site.name} />
    <meta property="og:title" content={resolvedTitle} />
    <meta property="og:description" content={resolvedDescription} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={site.origin + social.src} />
    <meta property="og:image:secure_url" content={site.origin + social.src} />
    <meta property="og:image:type" content="image/webp" />
    <meta property="og:image:width" content={String(social.width)} />
    <meta property="og:image:height" content={String(social.height)} />
    <meta property="og:image:alt" content={social.alt} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={resolvedTitle} />
    <meta name="twitter:description" content={resolvedDescription} />
    <meta name="twitter:image" content={site.origin + social.src} />
    <meta name="twitter:image:alt" content={social.alt} />
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- Fixed JSON-LD wrapper; the serializer escapes every less-than character in the JSON payload. -->
    {@html jsonLdScript(schemas)}
</svelte:head>
