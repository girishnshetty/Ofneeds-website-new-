<script lang="ts">
 import { resolve } from '$app/paths';
    import Icon from './Icon.svelte';
    const solutions = [
        { path: '/employee-welcome-kits-bangalore', title: 'Employee Onboarding Kits', text: 'Welcome new colleagues with branded work essentials and a personal message.' },
        { path: '/employee-gifts', title: 'Employee Appreciation Gifts', text: 'Recognize the people behind team milestones, anniversaries and everyday progress.' },
        { path: '/client-gifts', title: 'Client & Business Gifts', text: 'Coordinate useful products and considered packaging for business relationships.' },
        { path: '/event-merchandise', title: 'Branded Event Merchandise', text: 'Bring apparel, bags and work essentials together for conferences and company gatherings.' },
        { path: '/festive-corporate-gifts', title: 'Festive Gifts & Hampers', text: 'Plan seasonal gifting around your recipients, budget and delivery locations.' },
        { path: '/custom-gift-sets', title: 'Custom Corporate Gift Sets', text: 'Build a product mix with your logo, message and packaging, tailored to the occasion.' }
    ];
</script>
<section class="section section-muted" aria-labelledby="gifting-solutions-title"><div class="container"><div class="section-heading"><div><p class="eyebrow">Start with the occasion</p><h2 id="gifting-solutions-title">Employee Welcome Kits,<br />Apparel &amp; Branded Merchandise</h2></div><p>From a first day to a lasting partnership, choose gifts around the people receiving them.</p></div><div class="occasion-grid">{#each solutions as solution, index (solution.path)}<a class="occasion-card" href={resolve((solution.path) as `/${string}`)}><span class="occasion-number">0{index + 1}</span><h3>{solution.title}</h3><p>{solution.text}</p><span class="text-link">Explore the options <Icon size={17} /></span></a>{/each}</div></div></section>
