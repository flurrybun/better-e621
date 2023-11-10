import { posts, allDataFetched, fetchPage } from '$lib/stores/postsStore.js';
import { postsPerPage } from '$lib/stores/settingsStore.js';

let postsPerPage_value;

postsPerPage.subscribe((value) => {
	postsPerPage_value = value;
});

let posts_value;
let allDataFetched_value;

posts.subscribe((value) => {
	posts_value = value;
});

allDataFetched.subscribe((value) => {
	allDataFetched_value = value;
});

export async function load({ url }) {
	const searchQuery = url.searchParams.get('q');

	posts.set([]);
	allDataFetched.set(false);

	async function fetchNextPage() {
		if (allDataFetched_value) return [];

		const currentPage = Math.ceil(posts_value.length / postsPerPage_value);
		const nextPage = currentPage + 1;

		const cachedPosts = posts_value.slice();
		const data = await fetchPage(nextPage, searchQuery);

		posts.set([...cachedPosts, ...data]);

		return posts_value;
	}

	return {
		allDataFetched,
		searchQuery,
		fetchNextPage
	};
}
