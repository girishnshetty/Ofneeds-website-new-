<script lang="ts">
 import { catalogueForCategory, catalogueGroupsFor } from '$lib/data/catalogues';
 let { slug }: { slug: string } = $props();
 const groups = $derived(catalogueGroupsFor(slug));
 const selections = $derived(groups.map(group => catalogueForCategory(group)).filter(file => file !== undefined));
</script>
{#if selections.length}
<section class="section section-muted">
 <div class="container">
  <div class="section-heading"><div><p class="eyebrow">A closer look at the range</p><h2>Explore the Catalogues</h2></div><a class="text-link" href="/catalogues">View all catalogues →</a></div>
  <div class="catalogue-selections">
   {#each selections as file (file.id)}
    <a class="catalogue-selection" href={'/catalogues?category=' + encodeURIComponent(file.category)}>
     {#if file.hasCover}<img src={file.image} alt={file.alt} width={file.width} height={file.height} loading="lazy" decoding="async" />{:else}<div class="catalogue-placeholder">{file.format} catalogue</div>{/if}
     <h3>{file.category}</h3><span>Browse the collection →</span>
    </a>
   {/each}
  </div>
 </div>
</section>
{/if}
<style>
 .catalogue-selections{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:24px}
 .catalogue-selection{display:block;background:white;border:1px solid var(--line);border-radius:8px;overflow:hidden;padding-bottom:22px}
 img{width:100%;height:260px;object-fit:contain;background:#f3f6f7;padding:12px}
 .catalogue-placeholder{height:260px;display:grid;place-items:center;background:#f3f6f7;color:var(--blue);font-size:20px;font-weight:600}
 h3{margin:20px 22px 8px;font-size:19px}span{display:block;margin:0 22px;color:var(--blue);font-size:13px}
</style>
