import { allDataFetched, fetchPage, posts } from '$lib/stores/postsStore';
import { postsPerPage } from '$lib/stores/settingsStore';
import type { Post, Tag } from '$lib/types';
import type { PageLoad } from './$types';

let postsPerPage_value: number;
let posts_value: Post[];
let allDataFetched_value: boolean;

postsPerPage.subscribe((value) => {
	postsPerPage_value = value;
});

posts.subscribe((value) => {
	posts_value = value;
});

allDataFetched.subscribe((value) => {
	allDataFetched_value = value;
});

export const load: PageLoad = async ({ url, fetch }) => {
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

	async function fetchRelatedTags(): Promise<Tag[]> {
		const searchedTags = searchQuery.replace(/[~]/g, '').split(' ');

		const response = await fetch(
			'/api/related_tags?' +
				new URLSearchParams({
					tags: searchedTags.toString()
				}),
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			}
		);

		if (!response.ok) throw new Error('Failed to fetch data');

		const tags: Tag[] = await response.json();
		return tags;
	}

	return {
		searchQuery,
		fetchNextPage,
		relatedTags: fetchRelatedTags()
	};
};
