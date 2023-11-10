<script>
	import ArrowUpIcon from '~icons/feather/arrow-up';
	import ArrowDownIcon from '~icons/feather/arrow-down';
	import HeartIcon from '~icons/feather/heart';
	import PlayIcon from '~icons/feather/play';
	import { openModal } from 'svelte-modals';
	import GalleryModal from './GalleryModal.svelte';
	import { numberToAbbreviatedString } from '$lib/utils.js';

	export let data;
	export let postIndex;

	$: voteStatus = 0;
	$: postScore = data?.score.total + voteStatus;

	$: isFavorited = false;
	$: favCount = data?.fav_count + isFavorited;

	const updateVote = (vote) => {
		if (voteStatus === vote) {
			voteStatus = 0;
		} else {
			voteStatus = vote;
		}
	};

	const handleClickImage = () => {
		openModal(GalleryModal, {
			postIndex: postIndex
		});
	};
</script>

{#if data}
	<div
		class="inline-block 3xl:w-[calc(25%-12px)] xl:w-[calc(33.333%-10px)] lg:w-[calc(50%-8px)] sm:w-[calc(33.333%-10px)] xs:w-[calc(50%-8px)] pb-[16px]"
	>
		<div class="relative">
			<img
				loading="lazy"
				src={data.sample.url}
				alt=""
				class="w-full rounded-t-lg min-h-[12rem] max-h-96 cursor-pointer object-cover"
				on:click={handleClickImage}
			/>
			{#if data.file.ext === 'webm'}
				<div
					class="absolute p-4 bg-slate-900 bg-opacity-40 backdrop-blur-sm rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
				>
					<PlayIcon class="text-slate-100 text-xl" />
				</div>
			{/if}
		</div>
		<div class="p-3 bg-slate-900 rounded-b-lg flex justify-between">
			<div class="flex items-center gap-2.5">
				<div class="flex items-center gap-2.5">
					<button
						class="inactive"
						class:activeUpvote={voteStatus === 1}
						on:click={() => updateVote(1)}
					>
						<ArrowUpIcon />
					</button>
					<p
						class="text-lg"
						class:text-amber-400={voteStatus === 1}
						class:text-blue-400={voteStatus === -1}
					>
						{numberToAbbreviatedString(postScore)}
					</p>
					<button
						class="inactive"
						class:activeDownvote={voteStatus === -1}
						on:click={() => updateVote(-1)}
					>
						<ArrowDownIcon />
					</button>
				</div>
				<button
					class="bg-slate-800 text-slate-400 rounded-full h-7 px-2.5 flex items-center gap-1.5"
					on:click={() => (isFavorited = !isFavorited)}
				>
					<HeartIcon style="" />
					<p class="text-slate-100">{numberToAbbreviatedString(favCount)}</p>
				</button>
			</div>
			{#if data.rating === 's'}
				<div
					class="bg-yellow-400 text-yellow-900 font-semibold text-lg rounded-full aspect-square w-7 grid place-items-center"
				>
					S
				</div>
			{:else if data.rating === 'q'}
				<div
					class="bg-orange-400 text-orange-900 font-semibold text-lg rounded-full aspect-square w-7 grid place-items-center"
				>
					Q
				</div>
			{:else}
				<div
					class="bg-red-400 text-red-900 font-semibold text-lg rounded-full aspect-square w-7 grid place-items-center"
				>
					E
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.inactive {
		@apply bg-slate-800 text-slate-400 rounded-full aspect-square w-7 grid place-items-center;
	}

	.activeUpvote {
		@apply bg-amber-400 text-amber-900;
	}

	.activeDownvote {
		@apply bg-blue-400 text-blue-900;
	}
</style>
