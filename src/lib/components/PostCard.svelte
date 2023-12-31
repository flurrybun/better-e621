<script lang="ts">
	import { isUserLoggedIn } from '$lib/stores/settingsStore';
	import type { Post } from '$lib/types';
	import { numberToAbbreviatedString } from '$lib/utils';
	import { openModal } from 'svelte-modals';
	import ArrowDownIcon from '~icons/feather/arrow-down';
	import ArrowUpIcon from '~icons/feather/arrow-up';
	import HeartIcon from '~icons/feather/heart';
	import PlayIcon from '~icons/feather/play';
	import FlashWarning from './FlashWarning.svelte';
	import GalleryModal from './GalleryModal.svelte';

	export let postData: Post;
	export let postIndex: number;
	export let columns: number;

	$: itemWidth = `calc(${100 / columns}% - ${(16 * (columns - 1)) / columns}px)`;

	let voteStatus = 0;
	let isFavorited = false;

	$: postScore = postData?.score + voteStatus;
	$: favCount = postData?.favoriteCount + (isFavorited ? 1 : 0);

	const updateVote = (vote: -1 | 1) => {
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

{#if postData}
	<div class="pb-4" style="width: {itemWidth}">
		<div class="relative">
			{#if postData.type !== 'flash'}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<img
					loading="lazy"
					src={postData.thumbnail.toString()}
					alt=""
					class="w-full rounded-t-lg min-h-[12rem] max-h-96 cursor-pointer object-cover"
					on:click={handleClickImage}
				/>
				{#if postData.type === 'video'}
					<div
						class="absolute p-4 bg-slate-900 bg-opacity-40 backdrop-blur-sm rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
					>
						<PlayIcon class="text-slate-100 text-xl" />
					</div>
				{/if}
			{:else}
				<div class="bg-slate-900 rounded-t-lg">
					<FlashWarning downloadUrl={postData.files[0].url} />
				</div>
			{/if}
		</div>
		<div class="p-3 bg-slate-900 rounded-b-lg flex justify-between">
			<div class="flex items-center gap-2.5">
				{#if $isUserLoggedIn}
					<div class="flex items-center gap-2.5">
						<button
							class="inactive"
							class:active-upvote={voteStatus === 1}
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
							class:active-downvote={voteStatus === -1}
							on:click={() => updateVote(-1)}
						>
							<ArrowDownIcon />
						</button>
					</div>
					<button
						class="bg-slate-800 text-slate-400 rounded-full h-7 px-2.5 flex items-center gap-1.5"
						on:click={() => (isFavorited = !isFavorited)}
					>
						<HeartIcon />
						<p class="text-slate-100">{numberToAbbreviatedString(favCount)}</p>
					</button>
				{:else}
					<div class="bg-slate-800 rounded-full h-7 px-2.5 pr-3 flex items-center gap-1">
						{#if postScore >= 0}
							<ArrowUpIcon class="text-slate-400" />
						{:else}
							<ArrowDownIcon class="text-slate-400" />
						{/if}
						<p>{numberToAbbreviatedString(postScore)}</p>
					</div>
					<div class="bg-slate-800 rounded-full h-7 px-2.5 pr-3 flex items-center gap-1.5">
						<HeartIcon class="text-slate-400" />
						<p>{numberToAbbreviatedString(favCount)}</p>
					</div>
				{/if}
			</div>
			{#if postData.rating === 's'}
				<div class="bg-yellow-400 text-yellow-900 rating">S</div>
			{:else if postData.rating === 'q'}
				<div class="bg-orange-400 text-orange-900 rating">Q</div>
			{:else}
				<div class="bg-red-400 text-red-900 rating">E</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.inactive {
		@apply bg-slate-800 text-slate-400 rounded-full aspect-square w-7 grid place-items-center;
	}

	.active-upvote {
		@apply bg-amber-400 text-amber-900;
	}

	.active-downvote {
		@apply bg-blue-400 text-blue-900;
	}

	.rating {
		@apply font-semibold text-lg rounded-full aspect-square w-7 grid place-items-center;
	}
</style>
