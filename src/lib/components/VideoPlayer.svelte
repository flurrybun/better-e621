<script lang="ts">
	import type { Post } from '$lib/types';
	import SveltePlyr from './SveltePlyr.svelte';

	export let postData: Post;

	const videos = Object.values(postData.sample.alternates);
	const videoUrls = videos.map((video) => '/api/proxy?q=' + video.urls.find((url) => url !== null));
	const videoWidths = videos.map((video) => video.width);

	//workaround since size is an invalid attribute for source
	let sources = '';
	videoUrls.forEach((videoUrl, index) => {
		sources += `<source src="${videoUrl}" size="${videoWidths[index]}" />`;
	});

	const plyrConfig = {
		quality: {
			default: videoWidths[0],
			options: [...videoWidths]
		},
		playsinline: true
	};
</script>

<SveltePlyr {...plyrConfig}>
	<!-- svelte-ignore a11y-media-has-caption -->
	<video poster={postData.sample.url} src={videoUrls[0]}>
		{#each videoUrls as videoUrl, index}
			{@html sources}
		{/each}
	</video>
</SveltePlyr>

<style>
	video {
		width: 100vw !important;
	}
</style>
