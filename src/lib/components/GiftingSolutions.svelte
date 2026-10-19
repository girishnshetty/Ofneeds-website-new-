<script lang="ts">
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

<section class="section section-muted" aria-labelledby="gifting-solutions-title">
    <div class="container">
        <div class="section-heading">
            <div><p class="eyebrow">Start with the occasion</p><h2 id="gifting-solutions-title">Corporate Gifts for<br /> Every Business Moment</h2></div>
            <div class="solution-controls">
                <p>From a first day to a lasting partnership, choose a gifting solution around the people receiving it.</p>
            </div>
        </div>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard focus enables native horizontal scrolling in this labelled region.) -->
        <div class="solutions-strip" role="region" tabindex="0"
            aria-label="Corporate gifting solutions. Scroll horizontally to explore.">
            <div id="gifting-solutions-track" class="solutions-track">
                {#each [0, 1] as copy (copy)}
                    <div class="solutions-group" class:duplicate={copy === 1}
                        aria-hidden={copy === 1 ? true : undefined}>
                        {#each solutions as solution (solution.path)}
                            <a class="solution-card" href={solution.path} tabindex={copy === 1 ? -1 : undefined}>
                                <h3>{solution.title}</h3><p>{solution.text}</p><span class="text-link">Explore the options <Icon size={17} /></span>
                            </a>
                        {/each}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>

<style>
    .solution-controls { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; max-width: 360px; }
    .solution-controls p { margin: 0; font-size: 13px; }
    .solutions-strip { --solution-width: 360px; max-width: 100%; overflow-x: auto; padding-bottom: 14px; scrollbar-width: thin; scrollbar-color: #b6c6ce transparent; }
    .solutions-strip:focus-visible { outline: 2px solid var(--blue); outline-offset: 6px; border-radius: 6px; }
    .solutions-track { display: flex; width: max-content; animation: gifting-solutions-scroll 80s linear infinite; }
    .solutions-group { display: flex; flex-wrap: nowrap; width: max-content; gap: 24px; padding-right: 24px; }
    .solution-card { display: flex; flex: 0 0 var(--solution-width); width: var(--solution-width); min-width: 0; flex-direction: column; align-items: flex-start; gap: 16px; padding: 28px; border: 1px solid #d5e1e6; border-radius: 8px; background: white; text-decoration: none; color: inherit; }
    .solution-card h3 { font-size: 20px; margin: 0; }
    .solution-card p { margin: 0; flex: 1; }
    .solution-card:hover { border-color: #004f6b; }
    .solution-card:focus-visible { outline: 3px solid #007ca4; outline-offset: -4px; }
    .solutions-strip:hover .solutions-track,
    .solutions-strip:focus-within .solutions-track { animation-play-state: paused; }
    /* Keep every original link reachable while browsing with the keyboard. */
    .solutions-strip:has(:focus-visible) .solutions-track { animation: none; }
    @keyframes gifting-solutions-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @media (max-width: 768px) {
        .solutions-strip { --solution-width: min(310px, calc(100vw - 72px)); }
        .solutions-group { gap: 16px; padding-right: 16px; }
        .solution-card { padding: 24px; }
    }
    @media (prefers-reduced-motion: reduce) {
        .solutions-track { animation: none; }
        .solutions-group.duplicate { display: none; }
    }
</style>
