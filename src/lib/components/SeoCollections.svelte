<script lang="ts">
 import { resolve } from '$app/paths';
 import { seoLandings } from '$lib/data/seo-landings';
</script>
<section class="section section-muted"><div class="container">
 <div class="section-heading"><div><p class="eyebrow">Choose around your brief</p><h2>Gifting by Occasion, Product &amp; Budget</h2></div><p>Explore a focused collection, compare the details and bring us your shortlist.</p></div>
 <div class="seo-collections">{#each seoLandings as item (item.slug)}<a href={resolve(('/' + item.slug) as `/${string}`)}><h3>{item.h1}</h3><span aria-hidden="true">→</span></a>{/each}</div>
</div></section>
<style>
 .seo-collections{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.seo-collections a{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:24px;background:white;border:1px solid var(--line);border-radius:6px}.seo-collections h3{font-size:16px;line-height:1.45;margin:0}.seo-collections span{color:var(--blue)}
 @media(max-width:1000px){.seo-collections{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.seo-collections{grid-template-columns:1fr}}
</style>
