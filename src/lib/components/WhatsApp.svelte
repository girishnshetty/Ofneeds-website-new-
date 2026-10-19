<script lang="ts">
	import { whatsappUrl } from '$lib/data/site';
	let editing = $state(false);
</script>
<svelte:window onfocusin={(event) => { editing = event.target instanceof Element && !!event.target.closest('input,textarea,select'); }} onfocusout={() => { editing = false; }} />
<a
	class="whatsapp-float"
	class:editing
	href={whatsappUrl()}
	target="_blank"
	rel="external noopener noreferrer"
	aria-label="Discuss corporate gifts with OfNeeds on WhatsApp"
	><svg viewBox="0 0 32 32" width="25" height="25" fill="currentColor" aria-hidden="true"
		><path
			d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 2.3a10.7 10.7 0 1 1-5.5 19.9l-.4-.2-3.8 1 1-3.7-.3-.5A10.7 10.7 0 0 1 16 5.3Zm-4.2 5c-.3-.7-.7-.7-1-.7h-.8c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.5 1.5 3.7c.2.3 2.6 4 6.3 5.5 3.1 1.3 3.7 1 4.4.9.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5l-2.7-1.3c-.4-.2-.7-.3-1 .2-.3.4-1 1.3-1.3 1.5-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.1-1.9-1.1-1-1.9-2.1-2.1-2.5-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.2.1-.4 0-.6l-1.2-2.7Z"
		/></svg
	><span class="sr-only">WhatsApp Us</span></a
>
