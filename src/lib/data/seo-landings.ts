import entries from './seo-landings.json';
import { photography, type PhotoKey } from './photography';
import type { LandingPage } from './catalog';
export const seoLandings: LandingPage[] = entries.map(({ photoKey, faq, ...entry }) => {
 const photo = photography[photoKey as PhotoKey];
 return { ...entry, title: entry.title + ' | OfNeeds', image: photo.src, imageAlt: photo.alt, photo };
});
