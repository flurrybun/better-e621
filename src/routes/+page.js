export async function load({ fetch, url }) {
	const searchQuery = url.searchParams.get('q');
	let isAllDataFetched = false;
	let pageNumber = 0;

	async function fetchNextPage() {
		if (isAllDataFetched)
			return {
				posts: [],
				isAllDataFetched: true
			};

		pageNumber++;
		const POSTS_PER_REQUEST = 25;
		let url = `https://e621.net/posts.json?limit=${POSTS_PER_REQUEST}`;

		if (searchQuery !== null) url += `&tags=${encodeURIComponent(searchQuery)}`;
		url += `&page=${pageNumber}`;

		const res = await fetch(url);

		if (res.ok) {
			const data = await res.json();

			if (data.posts.length === 0) {
				isAllDataFetched = true;
				return {
					posts: [],
					isAllDataFetched: true
				};
			}

			return {
				posts: data.posts,
				isAllDataFetched: false
			};
		}
		return {
			status: res.status,
			error: new Error()
		};
	}

	return {
		streamed: {
			posts: fetchNextPage()
		},
		isAllDataFetched: isAllDataFetched,
		searchQuery: searchQuery,
		fetchNextPage: fetchNextPage
	};
}
