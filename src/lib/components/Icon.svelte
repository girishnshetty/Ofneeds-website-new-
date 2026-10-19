<script lang="ts">
	let { name = 'arrow', size = 24 }: { name?: string; size?: number } = $props();
	const paths: Record<string, string> = {
		arrow: 'M5 12h14m-6-6 6 6-6 6',
		box: 'm12 3 9 5v8l-9 5-9-5V8l9-5Zm-9 5 9 5 9-5M12 13v8M7.5 5.5l9 5',
		check: 'm5 12 4 4L19 6M21 12a9 9 0 1 1-9-9',
		tag: 'M20 13 11 22l-9-9V2h11l9 9M7 7h.01',
		grid: 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
		pen: 'm16 3 5 5L8 21H3v-5L16 3Zm-3 3 5 5',
		chat: 'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5Z',
		truck:
			'M1 5h13v13H1V5Zm13 5h4l4 4v4h-8M7 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm13 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
		settings: 'M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-7 0v6',
		menu: 'M4 6h16M4 12h16M4 18h16',
		close: 'm6 6 12 12M6 18 18 6',
		phone: 'M7 3H3v4c0 8 6 14 14 14h4v-4l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z',
		mail: 'M3 5h18v14H3V5Zm0 0 9 8 9-8',
		pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
		chevron: 'm6 9 6 6 6-6'
	};
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"><path d={paths[name] ?? paths.arrow} /></svg
>
