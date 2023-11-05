import { posts, allDataFetched, fetchPage } from '../stores/postsStore.js';

let posts_value;
let allDataFetched_value;

const POSTS_PER_REQUEST = 25;

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

		const currentPage = Math.ceil(posts_value.length / POSTS_PER_REQUEST);
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
