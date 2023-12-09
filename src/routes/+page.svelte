<script lang="ts">
	import { goto } from '$app/navigation';
	import Masonry from '$lib/components/Masonry.svelte';
	import TagInput from '$lib/components/TagInput.svelte';
	import { blacklistedTags } from '$lib/stores/settingsStore';
	import { numberToAbbreviatedString } from '$lib/utils';
	import { quartIn, quartOut } from 'svelte/easing';
	import { fly, slide } from 'svelte/transition';
	import LeftIcon from '~icons/feather/chevron-left';
	import SearchIcon from '~icons/feather/search';

	export let data;

	let searchValue: string[] = data.searchQuery.split(' ');
	let blacklistValue = $blacklistedTags;

	$: blacklistedTags.set(blacklistValue);

	function handleSearch() {
		const url = new URL(location.href);
		url.searchParams.set('q', searchValue.join(' '));
		goto(url, { replaceState: true });
	}

	let isSearchPanelOpen = false;
	let searchPanelOffsetHeight = 0;
	let searchPanel: HTMLDivElement;
	let searchInput: HTMLInputElement;

	function handleWindowFocusIn(e: FocusEvent) {
		if (!searchPanel.contains(e.target as Node)) isSearchPanelOpen = false;
	}
</script>

<svelte:window
	on:click={() => {
		if (isSearchPanelOpen) isSearchPanelOpen = false;
	}}
	on:focusin={handleWindowFocusIn}
/>

<svelte:head>
	{#if isSearchPanelOpen}
		<style>
			body {
				overflow: hidden;
			}
		</style>
	{/if}
</svelte:head>

{#if isSearchPanelOpen}
	<button
		class="fixed left-4 bottom-4 bg-slate-700 shadow-lg rounded-full py-2 px-3 pr-4 gap-1 z-20 flex items-center"
		on:click|stopPropagation={() => (isSearchPanelOpen = false)}
		in:fly={{ duration: 200, y: 70, opacity: 1, easing: quartOut }}
		out:fly={{ duration: 200, y: 70, opacity: 1, easing: quartIn }}
	>
		<LeftIcon class="text-slate-400" />
		<p>Back</p>
	</button>
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="lg:hidden sticky top-0 z-10 w-full bg-slate-950"
	bind:this={searchPanel}
	on:focusin={() => (isSearchPanelOpen = true)}
	on:click|stopPropagation
>
	<div class="p-3 max-w-xl mx-auto" bind:clientHeight={searchPanelOffsetHeight}>
		<form
			class=" bg-slate-900 rounded-lg flex focus-within:outline-2 focus-within:outline outline-amber-400 outline-offset-[-2px]"
			on:submit|preventDefault={handleSearch}
		>
			<div class="p-3 w-full">
				<TagInput
					bind:tags={searchValue}
					bind:input={searchInput}
					placeholder="Search posts"
					name="q"
					canSubmit
				/>
			</div>
			<button
				type="submit"
				class="bg-slate-800 rounded-md flex items-center justify-center p-2.5 m-1.5"
			>
				<SearchIcon class="text-slate-400" />
			</button>
		</form>
	</div>
	{#if isSearchPanelOpen}
		<div
			class="bg-slate-950 absolute top-full w-full"
			in:slide={{ duration: 500, easing: quartOut }}
			out:slide={{ duration: 300, easing: quartOut }}
		>
			<div
				class="max-w-xl mx-auto p-3 pt-0 flex flex-col gap-3 overflow-y-scroll pb-[4.2rem]"
				style="height: calc(100dvh - {searchPanelOffsetHeight}px);"
			>
				<div class="bg-slate-900 rounded-lg p-8">
					<h2 class="text-2xl font-semibold mb-3">Related tags</h2>
					{#await data.streamed.relatedTags}
						<p class="text-slate-400">Loading...</p>
					{:then relatedTags}
						<ol class="text-slate-400 grid grid-cols-2 grid-flow-dense">
							{#each relatedTags as tag (tag.id)}
								<li class={tag.name.length > 14 ? 'col-span-2' : ''}>
									{tag.name}
									<span class="text-slate-600 text-xs"
										>{numberToAbbreviatedString(tag.postCount)}</span
									>
								</li>
							{/each}
						</ol>
					{/await}
				</div>
				<div class="bg-slate-900 rounded-lg p-8">
					<h2 class="text-2xl font-semibold mb-3">Blacklisted tags</h2>
					<div
						class="rounded-lg bg-slate-800 bg-opacity-50 p-3 outline-amber-400 outline-2 focus-within:outline"
					>
						<TagInput bind:tags={blacklistValue} placeholder="Add tags" />
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<div class="mx-auto px-3 lg:px-4 gap-4 grid grid-cols-1 lg:grid-cols-[350px_1fr] lg:pt-4">
	<aside class="hidden lg:block sticky top-4 h-screen overflow-y-scroll no-scrollbar">
		<div class="flex items-end mb-4 gap-2">
			<img src="/images/logo.svg" alt="Logo" />
			<h1 class="text-2xl leading-[0.8] font-semibold">better e621</h1>
		</div>
		<form
			class="bg-slate-900 rounded-lg flex focus-within:outline-2 focus-within:outline outline-amber-400 outline-offset-[-2px]"
			on:submit|preventDefault={handleSearch}
		>
			<div class="p-3 w-full">
				<TagInput bind:tags={searchValue} placeholder="Search posts" name="q" canSubmit />
			</div>
			<button
				type="submit"
				class="bg-slate-800 rounded-md flex items-center justify-center p-2.5 m-1.5"
			>
				<SearchIcon class="text-slate-400" />
			</button>
		</form>
		<div class="bg-slate-900 rounded-lg p-8 mt-4">
			<h2 class="text-2xl font-semibold mb-3">Related tags</h2>
			{#await data.streamed.relatedTags}
				<p class="text-slate-400">Loading...</p>
			{:then relatedTags}
				<ol class="text-slate-400 grid grid-cols-2 grid-flow-dense">
					{#each relatedTags as tag (tag.id)}
						<li class={tag.name.length > 14 ? 'col-span-2' : ''}>
							{tag.name}
							<span class="text-slate-600 text-xs">{numberToAbbreviatedString(tag.postCount)}</span>
						</li>
					{/each}
				</ol>
			{/await}
		</div>
		<div class="bg-slate-900 rounded-lg p-8 mt-4">
			<h2 class="text-2xl font-semibold mb-3">Blacklisted tags</h2>
			<div
				class="rounded-lg bg-slate-800 bg-opacity-50 p-3 outline-amber-400 outline-2 focus-within:outline"
			>
				<TagInput bind:tags={blacklistValue} placeholder="Add tags" />
			</div>
		</div>
	</aside>
	{#await data.fetchNextPage()}
		<p class="text-slate-400">Loading...</p>
	{:then _}
		<Masonry />
	{/await}
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
