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
		}
	};
</script>

<SveltePlyr {...plyrConfig}>
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		poster={data.sample.url}
		src={videoUrls[0]}
		class="h-full w-full max-h-[90vh] max-w-[80vh]"
	>
		{#each videoUrls as videoUrl}
			<source src={videoUrl} />
		{/each}
	</video>
</SveltePlyr>
