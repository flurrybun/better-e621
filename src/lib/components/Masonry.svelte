<script>
	import PostCard from './PostCard.svelte';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';
	import { allDataFetched, posts } from '../stores/postsStore.js';
	import { postsPerPage } from '$lib/stores/settingsStore.js';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';

	const fetchNextPage = $page.data.fetchNextPage;

	let posts_value;
	let allDataFetched_value;
	let postsPerPage_value;

	let ig;

	posts.subscribe((value) => {
		posts_value = value;
	});

	allDataFetched.subscribe((value) => {
		allDataFetched_value = value;
	});

	postsPerPage.subscribe((value) => {
		postsPerPage_value = value;
	});

	let finishedRendering = false;
	let items = [];

	function getItems(nextGroupKey) {
		const nextItems = [];
		let nextKey = (nextGroupKey - 1) * postsPerPage_value;

		for (let i = 0; i < postsPerPage_value; i++) {
			nextKey = (nextGroupKey - 1) * postsPerPage_value + i;

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

		if (posts_value.length <= (+e.groupKey || 0) * postsPerPage_value) {
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
