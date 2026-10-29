import pages from './seo-pages.json';
import { giftBrandSeoForPath } from '../gift-card-brands';
export type SeoProfile = {
    title: string; description: string; keywords: string[]; updated: string;
    pageType: string; service?: string;
    faqs?: { question: string; answer: string }[];
};
export const seoPages: Record<string, SeoProfile> = pages;
export const seoFor = (path: string): SeoProfile | undefined => {
    const normalized = path.replace(/\/+$/, '') || '/';
    return seoPages[normalized] ?? giftBrandSeoForPath(normalized);
};
