<script lang="ts">
	import { page } from '$app/stores';
	import { allDataFetched, posts } from '$lib/stores/postsStore';
	import { postsPerPage } from '$lib/stores/settingsStore';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';
	import PostCard from './PostCard.svelte';

	const fetchNextPage = $page.data.fetchNextPage;

	let finishedRendering = false;
	let items: {
		groupKey: number;
		key: number;
	}[] = getItems(0);

	function getItems(groupKey: number) {
		return Array.from({ length: $posts.length - $postsPerPage * groupKey }, (_, i) => ({
			groupKey: groupKey + 1,
			key: groupKey * $postsPerPage + i
		}));
	}

	const requestAppend = async ({ detail: e }) => {
		if (finishedRendering) return;

		e.wait();

		const groupKey = +e.groupKey || 0;

		if ($posts.length <= groupKey * $postsPerPage) {
			if ($allDataFetched) {
				finishedRendering = true;

				e.ready();
				return;
			}

			await fetchNextPage();
		}

		e.ready();

		items = [...items, ...getItems(groupKey)];
	};

	let masonryWidth: number;
	$: columns = masonryWidth ? Math.floor(masonryWidth / 275) : 1;
</script>

<div bind:clientWidth={masonryWidth}>
	<MasonryInfiniteGrid {items} on:requestAppend={requestAppend} let:visibleItems>
		{#each visibleItems as { key }}
			<PostCard postData={$posts[key]} postIndex={key} {columns} />
		{/each}
	</MasonryInfiniteGrid>
</div>
