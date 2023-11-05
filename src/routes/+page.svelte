<script>
	import SearchIcon from '~icons/feather/search';
	import Masonry from '../components/Masonry.svelte';
	import { numberToAbbreviatedString } from '$lib/utils.js';

	export let data;

	let searchQuery = data.searchQuery;

	//dummy info cause im too lazy to implement it yet
	let relatedTags = [
		{
			name: 'mammal',
			count: 3158542
		},
		{
			name: 'hi-res',
			count: 628542
		},
		{
			name: 'female',
			count: 15854
		},
		{
			name: 'male',
			count: 12
		}
	];
</script>

<div class="container mx-auto px-4 pt-4 gap-6 grid lg:grid-cols-[350px_1fr] grid-cols-1">
	<aside class="hidden lg:block">
		<div class="flex items-end mb-4 gap-2">
			<img src="/images/logo.svg" alt="Logo" />
			<h1 class="text-2xl leading-[0.8] font-semibold">better e621</h1>
		</div>
		<form
			class="bg-slate-900 rounded-lg flex focus-within:outline-2 focus-within:outline outline-amber-400 outline-offset-[-2px]"
		>
			<input
				type="search"
				name="q"
				bind:value={searchQuery}
				placeholder="Search"
				class="placeholder:text-slate-600 bg-transparent pl-4 grow focus:outline-none focus:placeholder:text-slate-900"
			/>
			<button
				type="submit"
				class="bg-slate-800 rounded-md flex items-center justify-center p-2.5 m-1.5"
			>
				<SearchIcon class="text-slate-400" />
			</button>
		</form>
		<div class="bg-slate-900 rounded-lg p-8 mt-6">
			<h2 class="text-2xl font-semibold mb-3">Related tags</h2>
			<ol class="text-slate-400 grid grid-cols-2">
				{#each relatedTags as tag}
					<li>
						{tag.name}
						<span class="text-slate-600 text-xs">{numberToAbbreviatedString(tag.count)}</span>
					</li>
				{/each}
			</ol>
		</div>
	</aside>
	{#key data}
		<Masonry />
	{/key}
	<!-- {#key data.searchQuery}
		{console.log('test')}
	{/key} -->
</div>
