<script lang="ts">
 import { resolve } from '$app/paths';
 import { giftingGroups } from '$lib/data/gifting-navigation';
 import Icon from './Icon.svelte';
</script>

<section id="gifting-directory" class="section section-muted" aria-labelledby="gifting-directory-title">
 <div class="container">
  <div class="section-heading">
   <div><p class="eyebrow">Find the right starting point</p><h2 id="gifting-directory-title">Corporate gifts for<br />every business brief.</h2></div>
   <p>Explore by programme, product or budget. Each guide covers the choices and details to include in your enquiry.</p>
  </div>
  <div class="gifting-directory-grid">
   {#each giftingGroups as group (group.title)}
    <article>
     <h3>{group.title}</h3><p>{group.text}</p>
     <ul>{#each group.links as [label, path] (path)}<li><a href={resolve(path as `/${string}`)}>{label}<Icon size={15} /></a></li>{/each}</ul>
    </article>
   {/each}
  </div>
 </div>
</section>

<style>
 .gifting-directory-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
 article{padding:28px;background:var(--white,#fff);border:1px solid var(--border,#dce2df);border-radius:12px;min-width:0}
 h3{font-size:22px;margin:0 0 10px}article>p{font-size:13px;line-height:1.6;color:var(--muted,#59686b);margin-bottom:20px}
 ul{list-style:none;padding:0;margin:0}li+li{border-top:1px solid #edf0ed}a{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:12px 0;font-size:13px;font-weight:600;line-height:1.5;overflow-wrap:anywhere}a:hover{text-decoration:underline}a :global(svg){flex-shrink:0}
 @media(max-width:1000px){.gifting-directory-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:600px){.gifting-directory-grid{grid-template-columns:1fr}article{padding:23px}}
</style>
