<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { closeModal } from 'svelte-modals';
	import { sineIn, sineOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import ChevronLeft from '~icons/feather/chevron-left';
	import ChevronRight from '~icons/feather/chevron-right';
	import X from '~icons/feather/x';
	import { allDataFetched, posts } from '../stores/postsStore';
	import VideoPlayer from './VideoPlayer.svelte';

	const fetchNextPage = $page.data.fetchNextPage;

	export let isOpen: boolean;
	export let postIndex: number;

	let currentPost = postIndex;
	let postTransitionDirection: 'left' | 'right' = 'right';
	let windowWidth: number;
	let windowHeight: number;
	let contentWidth: number;
	let isImageLoaded = false;

	$: currentPost !== null && onContentChange();
	onMount(onContentChange);

	function onContentChange() {
		getContentWidth();
		isImageLoaded = false;

		const img = new Image();
		img.src = $posts[currentPost + 1].file.url;
		const img2 = new Image();
		img2.src = $posts[currentPost + 1].preview.url;
	}

	function getContentWidth() {
		const containerWidth = windowWidth * 0.8;
		const containerHeight = windowHeight * 0.9;

		const containerAspectRatio = containerWidth / containerHeight;
		const contentAspectRatio = $posts[currentPost].file.width / $posts[currentPost].file.height;

		if (contentAspectRatio < containerAspectRatio) {
			contentWidth =
				(containerHeight / $posts[currentPost].file.height) * $posts[currentPost].file.width;
		} else {
			contentWidth = containerWidth;
		}
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowLeft': //left arrow
				previousPost();
				break;
			case 'ArrowRight': //right arrow
				nextPost();
				break;
			case ' ': //spacebar
				nextPost();
				break;
			case 'Escape': //escape
				closeModal();
				break;
		}
	};

	const nextPost = () => {
		if (currentPost + 5 === $posts.length) fetchNextPage();
		if (currentPost >= $posts.length - 1 && $allDataFetched) return;
		postTransitionDirection = 'right';
		currentPost++;
	};

	const previousPost = () => {
		if (currentPost === 0) return;
		postTransitionDirection = 'left';
		currentPost--;
	};

	const flyIn = (el: Element) => {
		return fly(el, {
			easing: sineOut,
			duration: 100,
			x: 200 * (postTransitionDirection === 'left' ? -1 : 1),
			delay: 50
		});
	};

	const flyOut = (el: Element) => {
		return fly(el, {
			easing: sineIn,
			duration: 100,
			x: -200 * (postTransitionDirection === 'left' ? -1 : 1)
		});
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

<svelte:window
	on:keydown={handleKeyDown}
	on:resize={getContentWidth}
	bind:innerWidth={windowWidth}
	bind:innerHeight={windowHeight}
/>

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
				<div class="grid place-items-center relative" style={`width: ${contentWidth}px;`}>
					{#if $posts[currentPost].file.ext === 'webm'}
						<VideoPlayer postData={$posts[currentPost]} />
					{:else}
						<img
							on:load={() => (isImageLoaded = true)}
							src={$posts[currentPost].file.url}
							alt=""
							class="w-full h-full shadow-2xl rounded-2xl transition-opacity z-10"
							style="opacity: {isImageLoaded ? 1 : 0}"
						/>
						<img
							src={$posts[currentPost].preview.url}
							alt=""
							class="w-full h-full shadow-2xl rounded-2xl absolute"
						/>
					{/if}
				</div>
				{#if !(currentPost >= $posts.length - 1 && $allDataFetched)}
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
