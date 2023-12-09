<script>
	import { Modals } from 'svelte-modals';
	import '../app.css';
</script>

<slot />

<Modals>
	<div slot="backdrop" class="fixed inset-0 bg-slate-950 bg-opacity-80 backdrop-blur-lg z-20" />
</Modals>
