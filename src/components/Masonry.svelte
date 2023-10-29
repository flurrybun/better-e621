<script>
	import PostCard from './PostCard.svelte';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';
	import { getContext } from 'svelte';

	export let posts;
	const { fetchNextPage } = getContext('page-data');

	let isFinishedRendering = false;

	const POSTS_PER_REQUEST = 25;
	let items = getItems(0);

	function getItems(nextGroupKey) {
		let nextKey = nextGroupKey * POSTS_PER_REQUEST;
		let nextItems = [];

		for (let i = 0; i < POSTS_PER_REQUEST && nextKey < posts.length - 1; i++) {
			nextKey = nextGroupKey * POSTS_PER_REQUEST + i;
			nextItems.push({ groupKey: nextGroupKey, key: nextKey, postData: posts[nextKey] });
		}

		return nextItems;
	}
</script>

<MasonryInfiniteGrid
	class="container"
	column={0}
	{items}
	on:requestAppend={async ({ detail: e }) => {
		if (isFinishedRendering) return;

		e.wait();
		const nextPageData = await fetchNextPage();

		if (nextPageData.isAllDataFetched) {
			isFinishedRendering = true;
			e.ready();
			return;
		}

		e.ready();

		posts.push(...nextPageData.posts);
		const nextGroupKey = (+e.groupKey || 0) + 1;
		items = [...items, ...getItems(nextGroupKey)];
	}}
	let:visibleItems
>
	{#each visibleItems as item (item.key)}
		<PostCard data={item.data.postData} postIndex={item.key} />
	{/each}
</MasonryInfiniteGrid>
