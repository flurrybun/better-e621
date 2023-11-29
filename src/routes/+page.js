import { posts, allDataFetched, fetchPage } from '$lib/stores/postsStore.js';
import { postsPerPage } from '$lib/stores/settingsStore.js';

let postsPerPage_value;
let posts_value;
let allDataFetched_value;

postsPerPage.subscribe((value) => {
	postsPerPage_value = value;
});

posts.subscribe((value) => {
	posts_value = value;
});

allDataFetched.subscribe((value) => {
	allDataFetched_value = value;
});

export async function load({ url, fetch }) {
	const searchQuery = url.searchParams.get('q') || '';

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

	async function fetchRelatedTags() {
		let searchedTags = searchQuery.replace(/[*~]/g, '').split(' ');

		searchedTags = searchedTags.filter((tag) => {
			return !(tag.includes(':') || tag.includes('*') || tag.includes('-')) && tag !== '';
		});

		let res;

		console.log(searchedTags);

		if (searchedTags.length > 0) {
			res = await fetch(`https://e621.net/tags.json?search[name]=${searchedTags.toString()}`);
		} else {
			res = await fetch(`https://e621.net/tags.json?search[order]=count`);
		}

		if (!res.ok) throw new Error('Failed to fetch tags');
		const data = await res.json();

		let relatedTags = [];

		data.forEach((tag) => {
			const individualRelatedTags = tag.related_tags
				.split(' ')
				.filter((tag, index) => index % 2 == 0 && !searchedTags.includes(tag));

			relatedTags = [...relatedTags, ...individualRelatedTags];
		});

		const res2 = await fetch(
			`https://e621.net/tags.json?search[name]=${relatedTags.slice(0, 50).toString()}`
		);

		if (!res2.ok) throw new Error('Failed to fetch tags');
		const data2 = await res2.json();

		data2.sort((a, b) => {
			return b.post_count - a.post_count;
		});

		const formattedTags = data2.map((tag) => {
			return {
				name: tag.name,
				id: tag.id,
				count: tag.post_count
			};
		});

		return formattedTags.slice(0, 20);
	}

	return {
		searchQuery,
		fetchNextPage,
		relatedTags: fetchRelatedTags()
	};
}
