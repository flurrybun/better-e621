export async function load({ fetch, url }) {
	const query = url.searchParams.get('q');
	let res = await fetch(`https://e621.net/posts.json?tags=${encodeURIComponent(query)}`);

	if (res.ok) {
		return {
			streamed: {
				posts: res.json()
			},
			searchQuery: query
		};
	}
	return {
		status: res.status,
		error: new Error()
	};
}
