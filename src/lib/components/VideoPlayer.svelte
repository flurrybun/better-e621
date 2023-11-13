<script>
	import SveltePlyr from './SveltePlyr.svelte';

	export let data;

	const videos = Object.values(data.sample.alternates);
	const videoUrls = videos.map((video) => '/api/proxy?q=' + video.urls.find((url) => url !== null));
	const videoWidths = videos.map((video) => video.width);

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
	<video poster={data.sample.url} src={videoUrls[0]}>
		{#each videoUrls as videoUrl, index}
			<source src={videoUrl} size={videoWidths[index]} />
		{/each}
	</video>
</SveltePlyr>

<style>
	video {
		width: 100vw !important;
	}
</style>
