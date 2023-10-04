export async function load({ fetch, url }) {
	const searchQuery = url.searchParams.get('q');

	async function fetchData(lastPostID = null) {
		const POSTS_PER_REQUEST = 25;

		let url = `https://e621.net/posts.json?limit=${POSTS_PER_REQUEST}`;

		if (searchQuery !== null) url += `&tags=${encodeURIComponent(searchQuery)}`;
		if (lastPostID !== null) url += `&page=b${lastPostID}`;

		const res = await fetch(url);

		if (res.ok) return res.json();
		return {
			status: res.status,
			error: new Error()
		};
	}

	return {
		streamed: {
			posts: fetchData()
		},
		searchQuery: searchQuery,
		fetchData: fetchData
	};
}
