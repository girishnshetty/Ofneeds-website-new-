<script lang="ts">
 import { resolve } from '$app/paths';
	import { categories } from '$lib/data/categories';
	import { site, contactNumbers } from '$lib/data/site';
	import Icon from './Icon.svelte';
	import { quoteCount } from '$lib/quote';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	let menuOpen = $state(false);
	let giftsOpen = $state(false);
	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'Products', href: '/products' },
		{ name: 'Welcome Kits', href: '/employee-welcome-kits-bangalore' },
		{ name: 'Catalogues', href: '/catalogues' },
		{ name: 'Brands', href: '/brands' },
		{ name: 'About Us', href: '/about' },
		{ name: 'Contact', href: '/contact' }
	];
	function close() {
		menuOpen = false;
		giftsOpen = false;
	}
	afterNavigate(close);
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') { if (menuOpen || giftsOpen) document.getElementById('nav-menu-toggle')?.focus(); close(); }
	}}
/>
<header class="site-header">
	<div class="topbar">
		<div class="container topbar-inner">
			<span>Thoughtful gifts. Lasting impressions.</span>
			<a class="workspace-top-link" href={resolve('/workspace')} onclick={close}>Buyer workspace <Icon name="grid" size={12} /></a>
			<div class="topbar-phones">
				{#each contactNumbers as phone (phone.href)}
					<a href={'tel:' + phone.href}>{phone.display}</a>
				{/each}
			</div>
		</div>
	</div>
	<div class="container nav-row">
		<a class="navbar-logo" href={resolve("/")} aria-label="OfNeeds home" onclick={close}>
			<img src="/optimized/ofneeds-logo.webp" alt="OfNeeds" width="434" height="145" />
		</a>
		<nav id="main-navigation" aria-label="Main navigation" class:mobile-open={menuOpen}>
			<a href={resolve("/")} onclick={close}>Home</a>
			<details class="nav-dropdown" bind:open={giftsOpen}>
				<summary>Corporate Gifts <Icon name="chevron" size={13} /></summary>
				<div class="dropdown-panel">
					<p class="eyebrow">Find your gifting solution</p>
					<a href={resolve("/products")} onclick={close}
						>Explore all corporate gifts <Icon size={16} /></a
					>
					<div class="dropdown-grid">
						<a href={resolve('/gift-cards')} aria-current={page.url.pathname === '/gift-cards' ? 'page' : undefined} onclick={close}>Gift Cards · India</a>
						{#each categories as category (category.href)}<a href={resolve((category.href) as `/${string}`)} onclick={close}
								>{category.title}</a
							>{/each}
					</div>
				</div>
			</details>
			{#each links.slice(1) as link (link.href)}<a href={resolve((link.href) as `/${string}`)} aria-current={page.url.pathname === link.href ? 'page' : undefined} onclick={close}>{link.name}</a
				>{/each}
		</nav>
		<a class="button button-small nav-cta" href={resolve("/contact#quote")} onclick={close}
			>My Quote{#if $quoteCount}<span class="quote-count">{$quoteCount}</span>{:else}<Icon size={16} />{/if}</a
		>
		<button
			id="nav-menu-toggle"
			class="menu-toggle"
			type="button"
			aria-controls="main-navigation"
			aria-expanded={menuOpen}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			onclick={() => (menuOpen = !menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button
		>
	</div>
</header>

<style>
 .workspace-top-link { display:inline-flex; align-items:center; gap:7px; min-height:32px; }
 @media(max-width:760px) { .workspace-top-link { flex-shrink:0; margin-right:15px; font-size:10px; } .topbar-phones a:last-child { display:none; } .topbar-phones { justify-content:flex-end; } }
</style>
