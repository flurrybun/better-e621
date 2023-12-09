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
	import FlashWarning from './FlashWarning.svelte';
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

	let touchStartX = 0;
	let touchOffsetX = 0;
	let isHoldingTouch = false;
	let touchStartTime = 0;
	let isUsingKeyboard = true;

	$: currentPost !== null && onContentChange();
	onMount(onContentChange);

	function onContentChange() {
		getContentWidth();
		isImageLoaded = false;
		touchStartX = 0;
		touchOffsetX = 0;

		if (!$posts[currentPost + 1]) return;

		//prefetch next image to speed image loads
		const img = new Image();
		img.src = $posts[currentPost + 1].files.at(-1)?.url.toString() ?? '';
		const img2 = new Image();
		img2.src = $posts[currentPost + 1].files.at(0)?.url.toString() ?? '';
	}

	function getContentWidth() {
		const containerWidth = windowWidth * (windowWidth > 1024 ? 0.8 : 0.9);
		const containerHeight = windowHeight * 0.9;

		const postWidth = $posts[currentPost].files.at(-1)?.width ?? 1;
		const postHeight = $posts[currentPost].files.at(-1)?.height ?? 1;

		const containerAspectRatio = containerWidth / containerHeight;
		const contentAspectRatio = postWidth / postHeight;

		if (contentAspectRatio < containerAspectRatio) {
			contentWidth = (containerHeight / postHeight) * postWidth;
		} else {
			contentWidth = containerWidth;
		}
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		isUsingKeyboard = true;

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
		if (currentPost >= $posts.length - 1 && $allDataFetched) return;
		if (!$posts[currentPost + 1]) return;

		if (currentPost + 5 === $posts.length && !$allDataFetched) fetchNextPage();

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

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.changedTouches[0].clientX;
		touchStartTime = Date.now();

		isHoldingTouch = true;
		isUsingKeyboard = false;
	}

	function handleTouchMove(e: TouchEvent) {
		touchOffsetX = e.changedTouches[0].clientX - touchStartX;
	}

	function handleTouchEnd(e: TouchEvent) {
		const timeDifference = Date.now() - touchStartTime;
		const velocity = Math.abs(touchOffsetX) / timeDifference;
		const direction = touchOffsetX > 0 ? 'right' : 'left';

		touchOffsetX = 0;
		isHoldingTouch = false;

		if (velocity < 0.5) return;

		if (direction === 'left') nextPost();
		else previousPost();
	}
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
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div
		class="fixed inset-0 flex items-center justify-center z-30"
		role="dialog"
		on:click={(e) => {
			if (e.target === e.currentTarget) closeModal();
		}}
		on:touchmove={handleTouchMove}
		on:touchstart={handleTouchStart}
		on:touchend={handleTouchEnd}
	>
		{#key currentPost}
			<div
				class="absolute flex items-center {!isHoldingTouch && !isUsingKeyboard
					? 'duration-300'
					: ''}"
				style="transform: translateX({touchOffsetX}px);"
				in:flyIn
				out:flyOut
			>
				<button
					class="hidden lg:grid text-slate-500 mr-3 w-9 h-9 place-items-center cursor-pointer rounded-full transition-all hover:bg-slate-700 hover:bg-opacity-40 hover:text-slate-400"
					style="opacity: {currentPost > 0 ? 1 : 0}"
					on:click={previousPost}
				>
					<ChevronLeft />
				</button>
				{#if $posts[currentPost].type !== 'flash'}
					<div class="grid place-items-center relative" style={`width: ${contentWidth}px;`}>
						{#if $posts[currentPost].type === 'video'}
							<VideoPlayer postData={$posts[currentPost]} />
						{:else}
							<img
								on:load={() => (isImageLoaded = true)}
								src={$posts[currentPost].files.at(-1)?.url.toString()}
								alt=""
								class="w-full h-full shadow-2xl rounded-2xl z-50 transition-all"
								style="opacity: {isImageLoaded ? 1 : 0}"
							/>
							<img
								src={$posts[currentPost].files.at(0)?.url.toString()}
								alt=""
								class="w-full h-full shadow-2xl rounded-2xl absolute"
							/>
						{/if}
					</div>
				{:else}
					<FlashWarning
						class="bg-slate-900 shadow-xl rounded-xl w-[25rem] max-w-[90vw]"
						downloadUrl={$posts[currentPost].files[0].url}
					/>
				{/if}
				<button
					class="hidden lg:grid text-slate-500 ml-3 w-9 h-9 place-items-center cursor-pointer rounded-full transition-all hover:bg-slate-700 hover:bg-opacity-40 hover:text-slate-400"
					style="opacity: {!(currentPost >= $posts.length - 1 && $allDataFetched) ? 1 : 0}"
					on:click={nextPost}
				>
					<ChevronRight />
				</button>
			</div>
		{/key}

		<div class="hidden lg:block absolute top-0 right-0 m-6">
			<button
				class="bg-slate-800 text-slate-500 bg-opacity-40 rounded-md w-11 aspect-square grid place-items-center cursor-pointer transition-all hover:bg-slate-700 hover:bg-opacity-40 hover:text-slate-400"
				on:click={closeModal}><X /></button
			>
		</div>
	</div>
{/if}
