<script>
	import PostCard from './PostCard.svelte';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';
	import { allDataFetched, posts } from '../stores/postsStore.js';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';

	const fetchNextPage = $page.data.fetchNextPage;

	let posts_value;
	let allDataFetched_value;

	let ig;

	posts.subscribe((value) => {
		posts_value = value;
	});

	allDataFetched.subscribe((value) => {
		allDataFetched_value = value;
	});

	const POSTS_PER_REQUEST = 25;
	let finishedRendering = false;
	let items = [];

	function getItems(nextGroupKey) {
		const nextItems = [];
		let nextKey = (nextGroupKey - 1) * POSTS_PER_REQUEST;

		for (let i = 0; i < POSTS_PER_REQUEST; i++) {
			nextKey = (nextGroupKey - 1) * POSTS_PER_REQUEST + i;

			if (posts_value.length < nextKey + 1) return nextItems;

			nextItems.push({ groupKey: nextGroupKey, key: nextKey });
		}

		return nextItems;
	}
</script>

<MasonryInfiniteGrid
	bind:this={ig}
	class="container"
	column={0}
	{items}
	on:requestAppend={async ({ detail: e }) => {
		if (finishedRendering) return;

		e.wait();

		if (posts_value.length <= (+e.groupKey || 0) * POSTS_PER_REQUEST) {
			if (allDataFetched_value) {
				finishedRendering = true;
				e.ready();
				return;
			}

			await fetchNextPage();
		}

		e.ready();

		const nextGroupKey = (+e.groupKey || 0) + 1;
		items = [...items, ...getItems(nextGroupKey)];
	}}
	let:visibleItems
>
	{#each visibleItems as item (item.key)}
		<PostCard data={posts_value[item.key]} postIndex={item.key} />
	{/each}
</MasonryInfiniteGrid>
