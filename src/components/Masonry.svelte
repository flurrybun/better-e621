<script>
	import PostCard from './PostCard.svelte';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';
	export let data;

	let items = getItems(0, 10);

	function getItems(nextGroupKey, count) {
		const nextItems = [];

		for (let i = 0; i < count; i++) {
			const nextKey = nextGroupKey * count + i;

			nextItems.push({ groupKey: nextGroupKey, key: nextKey });
		}
		return nextItems;
	}
</script>

<MasonryInfiniteGrid
	class="container"
	column={0}
	{items}
	on:requestAppend={({ detail: e }) => {
		const nextGroupKey = (+e.groupKey || 0) + 1;

		items = [...items, ...getItems(nextGroupKey, 10)];
	}}
	let:visibleItems
>
	{#each visibleItems as item (item.key)}
		<PostCard data={data.posts[item.key]} />
	{/each}
</MasonryInfiniteGrid>
