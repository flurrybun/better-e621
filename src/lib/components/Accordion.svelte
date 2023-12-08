<!-- this component is unused but maybe it will get used later
  (probably not honestly i just like it and don't wanna delete it) -->

<script lang="ts">
	import DownIcon from '~icons/feather/chevron-down';
	import { slide } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';

	export let loading = false;
	export let title = '';

	let isOpen = false;
</script>

<div>
	<button
		class="w-full group flex bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-slate-700 transition-colors rounded-t-lg p-4 items-center justify-between {isOpen
			? 'border-b-2'
			: 'rounded-b-lg'}"
		on:click={() => (isOpen = !isOpen)}
	>
		<h2 class="text-xl font-semibold">{title}</h2>
		<div
			class="bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300 transition-colors rounded-full p-1.5"
		>
			<DownIcon />
		</div>
	</button>
	{#if isOpen}
		<div
			class="bg-slate-900 rounded-b-lg p-4"
			transition:slide={{ duration: 300, easing: quartOut }}
		>
			{#if !loading}
				<slot />
			{:else}
				<p class="text-slate-400">Loading...</p>
			{/if}
		</div>
	{/if}
</div>
