<script>
	import SearchIcon from '~icons/feather/search';
	import Masonry from '../components/Masonry.svelte';
	import { setContext } from 'svelte';

	export let data;

	const fetchNextPage = data.fetchNextPage;
	const isAllDataFetched = data.isAllDataFetched;
	setContext('page-data', { fetchNextPage, isAllDataFetched });

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

	function abbreviateNumber(value) {
		let newValue = value;
		const suffixes = ['', 'k', 'M', 'B', 'T'];
		let suffixNum = 0;
		while (newValue >= 1000) {
			newValue /= 1000;
			suffixNum++;
		}

		newValue = newValue.toString().length > 2 ? newValue.toPrecision(3) : newValue.toPrecision();
		newValue += suffixes[suffixNum];
		return newValue;
	}

	let searchQuery = data.searchQuery;
</script>

<div class="container mx-auto px-4 pt-4 gap-6 grid lg:grid-cols-[350px_1fr] grid-cols-1">
	<aside class="hidden lg:block">
		<div class="flex items-end mb-4 gap-2">
			<img src="/images/logo.svg" alt="Logo" />
			<h1 class="text-2xl leading-[0.8] font-semibold">better e621</h1>
		</div>
		<form
			method="get"
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
						{tag.name} <span class="text-slate-600 text-xs">{abbreviateNumber(tag.count)}</span>
					</li>
				{/each}
			</ol>
		</div>
	</aside>
	{#key data}
		{#await data.streamed.posts}
			Loading...
		{:then streamedData}
			<Masonry posts={streamedData.posts} />
		{/await}
	{/key}
</div>
