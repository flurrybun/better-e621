export async function GET({ url }) {
	const videoUrl = url.searchParams.get('q');

	const res = await fetch(videoUrl);
	return res;
}
