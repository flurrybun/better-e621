<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Plyr from 'plyr';
	import 'plyr/dist/plyr.css';

	let player: Plyr;
	let plyrDiv: HTMLDivElement;

	onMount(async () => {
		player = new Plyr(plyrDiv.firstChild as HTMLElement, $$restProps as Plyr.Options);
	});

	onDestroy(() => {
		player.destroy();
	});
</script>

<div bind:this={plyrDiv}>
	<slot />
</div>

<style>
	:root {
		--plyr-color-main: #fbbf24;
	}
</style>
