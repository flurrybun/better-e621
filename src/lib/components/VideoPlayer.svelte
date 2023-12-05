<script lang="ts">
	import type { Post } from '$lib/types';
	import SveltePlyr from './SveltePlyr.svelte';

	export let postData: Post;

	const videos = postData.files;

	//workaround since size is an invalid attribute for source
	let sources = '';
	videos.forEach((video) => {
		sources += `<source src="/api/proxy?q=${video.url}" size="${video.width}" />`;
	});

	const plyrConfig = {
		quality: {
			default: videos[0].width,
			options: videos.map((video) => video.width)
		},
		playsinline: true
	};
</script>

<SveltePlyr {...plyrConfig}>
	<!-- svelte-ignore a11y-media-has-caption -->
	<video poster={postData.thumbnail?.toString()} src={videos[0].url.toString()}>
		{@html sources}
	</video>
</SveltePlyr>

<style>
	video {
		width: 100vw !important;
	}
</style>
