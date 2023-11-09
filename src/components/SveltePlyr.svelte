<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import Plyr from 'plyr';
	import 'plyr/dist/plyr.css';

	export let eventsToEmit = [];
	export let player = {};
	let plyrDiv;
	const dispatch = createEventDispatcher();

	onMount(async () => {
		player = new Plyr(plyrDiv.firstChild, $$restProps);
		eventsToEmit.forEach((event) => dispatchOnPlayerEvent(event));
	});

	onDestroy(() => {
		player.destroy();
	});

	function dispatchOnPlayerEvent(event) {
		player.on(event, (data) => dispatch(event, data.detail.plyr));
	}
</script>

<div bind:this={plyrDiv}>
	<slot />
</div>

<style>
	:root {
		--plyr-color-main: #fbbf24;
	}
</style>
