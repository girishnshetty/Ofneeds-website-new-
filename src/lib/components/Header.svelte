<script lang="ts">
	import { categories } from '$lib/data/catalog';
	import { site, contactNumbers } from '$lib/data/site';
	import Icon from './Icon.svelte';
	let menuOpen = $state(false);
	let giftsOpen = $state(false);
	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'Welcome Kits', href: '/employee-welcome-kits-bangalore' },
		{ name: 'Apparel', href: '/corporate-apparel' },
		{ name: 'Drinkware', href: '/corporate-drinkware' },
		{ name: 'Awards', href: '/corporate-trophies-awards' },
		{ name: 'Bags', href: '/corporate-backpacks' },
		{ name: 'Brands', href: '/brands' },
		{ name: 'Clients', href: '/clients' },
		{ name: 'About Us', href: '/about' },
		{ name: 'Contact', href: '/contact' }
	];
	function close() {
		menuOpen = false;
		giftsOpen = false;
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') close();
	}}
/>
<header class="site-header">
	<div class="topbar">
		<div class="container topbar-inner">
			<span>Thoughtful gifts. Lasting impressions.</span>
			<div class="topbar-phones">
				{#each contactNumbers as phone (phone.href)}
					<a href={'tel:' + phone.href}>{phone.display}</a>
				{/each}
			</div>
		</div>
	</div>
	<div class="container nav-row">
		<a class="navbar-logo" href="/" aria-label="OfNeeds home" onclick={close}>
			<img src={site.navbarLogo} alt="OfNeeds" width="2172" height="724" />
		</a>
		<nav id="main-navigation" aria-label="Main navigation" class:mobile-open={menuOpen}>
			<a href="/" onclick={close}>Home</a>
			<details class="nav-dropdown" bind:open={giftsOpen}>
				<summary>Corporate Gifts <Icon name="chevron" size={13} /></summary>
				<div class="dropdown-panel">
					<p class="eyebrow">Find your gifting solution</p>
					<a href="/corporate-gifting-bangalore" onclick={close}
						>Explore all corporate gifts <Icon size={16} /></a
					>
					<div class="dropdown-grid">
						{#each categories as category (category.href)}<a href={category.href} onclick={close}
								>{category.title}</a
							>{/each}
					</div>
				</div>
			</details>
			{#each links.slice(1) as link (link.href)}<a href={link.href} onclick={close}>{link.name}</a
				>{/each}
		</nav>
		<a class="button button-small nav-cta" href="/contact#quote" onclick={close}
			>Get a Quote <Icon size={16} /></a
		>
		<button
			class="menu-toggle"
			type="button"
			aria-controls="main-navigation"
			aria-expanded={menuOpen}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			onclick={() => (menuOpen = !menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button
		>
	</div>
</header>
