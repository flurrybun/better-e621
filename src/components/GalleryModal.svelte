<script>
	import { closeModal } from 'svelte-modals';
	import { fly } from 'svelte/transition';
	import { sineIn, sineOut } from 'svelte/easing';
	import ChevronLeft from '~icons/feather/chevron-left';
	import ChevronRight from '~icons/feather/chevron-right';
	import X from '~icons/feather/x';
	import { page } from '$app/stores';
	import { allDataFetched, posts } from '../stores/postsStore.js';
	import VideoPlayer from './VideoPlayer.svelte';

	const fetchNextPage = $page.data.fetchNextPage;

	let posts_value;
	let allDataFetched_value;

	posts.subscribe((value) => {
		posts_value = value;
	});

	allDataFetched.subscribe((value) => {
		allDataFetched_value = value;
	});

	export let isOpen;
	export let postIndex;

	let currentPost = postIndex;
	let postTransitionDirection; //-1 for left, 1 for right

	const handleKeyDown = (event) => {
		switch (event.keyCode) {
			case 37: //left arrow
				previousPost();
				break;
			case 39: //right arrow
				nextPost();
				break;
			case 32: //spacebar
				nextPost();
				break;
			case 27: //escape
				closeModal();
				break;
		}
	};

	const nextPost = () => {
		if (currentPost + 5 === posts_value.length) fetchNextPage();
		if (currentPost >= posts_value.length - 1 && allDataFetched_value) return;
		postTransitionDirection = 1;
		currentPost++;
	};

	const previousPost = () => {
		if (currentPost === 0) return;
		postTransitionDirection = -1;
		currentPost--;
	};

	const flyIn = (el) => {
		return fly(el, {
			easing: sineOut,
			duration: 100,
			x: 200 * postTransitionDirection,
			delay: 50
		});
	};

	const flyOut = (el) => {
		return fly(el, { easing: sineIn, duration: 100, x: -200 * postTransitionDirection });
	};
</script>

<svelte:head>
	{#if isOpen}
		<style>
			body {
				overflow: hidden;
			}
		</style>
	{/if}
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

{#if isOpen}
	<div role="dialog" class="fixed inset-0 flex items-center justify-center">
		{#key currentPost}
			<div class="absolute flex items-center" in:flyIn out:flyOut>
				{#if currentPost > 0}
					<button
						class="text-slate-500 mr-3 w-9 h-9 grid place-items-center cursor-pointer rounded-full transition-all hover:bg-slate-700 hover:bg-opacity-40 hover:text-slate-400"
						on:click={previousPost}
					>
						<ChevronLeft />
					</button>
				{/if}
				{#if (posts_value[currentPost].file.ext = 'webm')}
					<VideoPlayer data={posts_value[currentPost]} />
				{:else}
					<img
						src={posts_value[currentPost].sample.url}
						alt=""
						class="rounded-2xl h-full w-full max-h-[90vh] max-w-[80vh] shadow-2xl"
					/>
				{/if}
				{#if !(currentPost >= posts_value.length - 1 && allDataFetched_value)}
					<button
						class="text-slate-500 ml-3 w-9 h-9 grid place-items-center cursor-pointer rounded-full transition-all hover:bg-slate-700 hover:bg-opacity-40 hover:text-slate-400"
						on:click={nextPost}
					>
						<ChevronRight />
					</button>
				{/if}
			</div>
		{/key}
		<div class="absolute top-0 right-0 m-6">
			<button
				class="bg-slate-800 text-slate-500 bg-opacity-40 rounded-md w-11 aspect-square grid place-items-center cursor-pointer transition-all hover:bg-slate-700 hover:bg-opacity-40 hover:text-slate-400"
				on:click={closeModal}><X /></button
			>
		</div>
	</div>
{/if}
