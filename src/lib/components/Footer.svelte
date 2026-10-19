<script lang="ts">
 import { resolve } from '$app/paths';
	import { site, contactNumbers } from '$lib/data/site';
	const columns = [
		{
			name: 'Company',
			links: [
				['Explore Products', '/products'],
				['About Us', '/about'],
				['Clients', '/clients'],
				['Brands', '/brands'],
				['Contact', '/contact']
			]
		},
		{
			name: 'Corporate Gifts',
			links: [
				['Welcome Kits', '/employee-welcome-kits-bangalore'],
				['Apparel', '/corporate-apparel'],
				['Drinkware', '/corporate-drinkware'],
				['Awards', '/corporate-trophies-awards'],
				['Bags', '/corporate-backpacks']
			]
		},
		{
			name: 'Resources',
			links: [
				['FAQ', '/#faq'],
				['Insights', '/insights'],
				['Catalogues', '/catalogues'],
				['Privacy Policy', '/privacy-policy'],
				['Terms & Conditions', '/terms-and-conditions']
			]
		}
	];
</script>

<footer class="site-footer">
	<div class="container footer-grid">
		<div class="footer-brand">
			<a class="footer-logo" href={resolve("/")} aria-label="OfNeeds home">
				<img
					src="/optimized/ofneeds-logo.webp"
					alt="OfNeeds"
					width="434"
					height="145"
					loading="lazy"
					decoding="async"
				/>
			</a>
			<p>Thoughtful corporate gifting.<br />Built around your brand.</p>
		</div>
		{#each columns as column (column.name)}<div>
				<h2>{column.name}</h2>
				<ul>
					{#each column.links as [label, href] (href)}<li><a href={resolve((href) as `/${string}`)}>{label}</a></li>{/each}
				</ul>
			</div>{/each}
		<div>
			<h2>Let’s talk gifting</h2>
			<a href={'mailto:' + site.email}>{site.email}</a>
			{#each contactNumbers as phone (phone.href)}
				<a href={'tel:' + phone.href}>{phone.display}</a>
			{/each}
			<p>{site.location}</p>
			<p>Established in {site.founded}</p>
		</div>
	</div>
	<div class="container footer-bottom">
		<p>© {new Date().getFullYear()} OfNeeds. All rights reserved.</p>
		<a href={resolve("/corporate-gifting-bangalore")}>Bengaluru based. India wide.</a>
	</div>
</footer>
