<script>
	import { closeModal } from 'svelte-modals';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import { sineIn, sineOut } from 'svelte/easing';
	import ChevronLeft from '~icons/feather/chevron-left';
	import ChevronRight from '~icons/feather/chevron-right';
	import X from '~icons/feather/x';

	export let isOpen;
	export let postIndex;

	let currentPost = postIndex;
	let postTransitionDirection; //-1 for left, 1 for right

	const handleKeyDown = (event) => {
		switch (event.keyCode) {
			case 37: //left
				previousPost();
				break;
			case 39: //right
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
		// add logic if it is the last post
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

	//{data.posts[currentPost].sample.url}
	//"https://picsum.photos/seed/{data.posts[currentPost].id}/{data.posts[currentPost].sample.width}/{data.posts[currentPost].sample.height}"
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
		{#await $page.data.streamed.posts then data}
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
					<img
						src={data.posts[currentPost].sample.url}
						alt=""
						class="rounded-2xl h-full w-full max-h-[90vh] max-w-[80vh] shadow-2xl"
					/>
					<button
						class="text-slate-500 ml-3 w-9 h-9 grid place-items-center cursor-pointer rounded-full transition-all hover:bg-slate-700 hover:bg-opacity-40 hover:text-slate-400"
						on:click={nextPost}
					>
						<ChevronRight />
					</button>
				</div>
			{/key}
		{:catch error}
			Error loading image
		{/await}
		<div class="absolute top-0 right-0 m-6">
			<button
				class="bg-slate-800 text-slate-500 bg-opacity-40 rounded-md w-11 aspect-square grid place-items-center cursor-pointer transition-all hover:bg-slate-700 hover:bg-opacity-40 hover:text-slate-400"
				on:click={closeModal}><X /></button
			>
		</div>
	</div>
{/if}
