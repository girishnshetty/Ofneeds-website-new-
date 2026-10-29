import { site, contactNumbers } from '$lib/data/site';
export type Schema = Record<string, unknown>;
export const canonical = (path: string) =>
    site.origin + (path === '/' ? '/' : path.replace(/\/+$/, ''));
export const organization: Schema = {
    '@type': 'Organization', '@id': site.origin + '/#organization',
    name: site.name, url: site.origin + '/', foundingDate: site.founded,
    description: 'Bengaluru corporate gifting company providing branded merchandise, employee welcome kits and custom gift sets with delivery across India.',
    logo: { '@type': 'ImageObject', url: site.origin + site.navbarLogo, width: 2172, height: 724 },
    email: site.email, telephone: site.phoneLink,
    address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' },
    areaServed: { '@type': 'Country', name: 'India' },
    knowsAbout: ['Corporate gifting', 'Corporate gift cards', 'Employee reward vouchers', 'Employee welcome kits', 'Branded merchandise', 'Corporate apparel', 'Custom gift sets'],
    contactPoint: contactNumbers.map((phone) => ({
        '@type': 'ContactPoint', telephone: phone.href, contactType: 'sales', email: site.email,
        areaServed: 'IN', availableLanguage: 'English'
    }))
};
export const website: Schema = {
    '@type': 'WebSite', '@id': site.origin + '/#website', url: site.origin + '/',
    name: site.name, inLanguage: 'en-IN', publisher: { '@id': site.origin + '/#organization' }
};
export const breadcrumbs = (items: { name: string; path: string }[]): Schema => ({
    '@type': 'BreadcrumbList', itemListElement: items.map((item, i) => ({
        '@type': 'ListItem', position: i + 1, name: item.name, item: canonical(item.path)
    }))
});
export const faqSchema = (faqs: { question: string; answer: string }[]): Schema => ({
    '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({
        '@type': 'Question', name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
});
export const jsonLd = (schemas: Schema[]) =>
    JSON.stringify({ '@context': 'https://schema.org', '@graph': schemas }).replace(/</g, '\\u003c');
export const jsonLdScript = (schemas: Schema[]) => `<script type="application/ld+json">${jsonLd(schemas)}</script>`;
