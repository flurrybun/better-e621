<script lang="ts">
	import AlertIcon from '~icons/feather/alert-triangle';
	import DownloadIcon from '~icons/feather/download';

	export let downloadUrl: URL;
</script>

<div class="p-7 flex flex-col items-center gap-3 {$$props.class}">
	<div class="bg-amber-400 text-amber-900 p-3 rounded-full">
		<AlertIcon class="text-2xl" />
	</div>
	<p class="text-center">This post is an Adobe Flash file, which is no longer supported.</p>
	{#if downloadUrl}
		<a
			href={downloadUrl.toString()}
			class="bg-slate-800 hover:bg-slate-700 transition-colors py-1 px-3 rounded-md flex items-center gap-2 mt-3 group"
		>
			<DownloadIcon class="text-slate-400 group-hover:text-slate-300 transition-colors" />
			<p>Download</p>
		</a>
	{/if}
</div>
