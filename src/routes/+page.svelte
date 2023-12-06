<script lang="ts">
	import { goto } from '$app/navigation';
	import Masonry from '$lib/components/Masonry.svelte';
	import TagInput from '$lib/components/TagInput.svelte';
	import { blacklistedTags } from '$lib/stores/settingsStore';
	import { numberToAbbreviatedString } from '$lib/utils';
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
</script>

<div class="mx-auto px-4 pt-4 gap-6 grid lg:grid-cols-[350px_1fr] grid-cols-1">
	<aside class="hidden lg:block">
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
		<div class="bg-slate-900 rounded-lg p-8 mt-6">
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
		<div class="bg-slate-900 rounded-lg p-8 mt-6">
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
