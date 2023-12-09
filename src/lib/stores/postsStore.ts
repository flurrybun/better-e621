import { blacklistedTags, postsPerPage } from '$lib/stores/settingsStore';
import type { Post } from '$lib/types';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

let blacklistedTags_value: string[];
let postsPerPage_value: number;

blacklistedTags.subscribe((value) => {
	blacklistedTags_value = value;
});

postsPerPage.subscribe((value) => {
	postsPerPage_value = value;
});

export const posts: Writable<Post[]> = writable([]);
export const allDataFetched: Writable<boolean> = writable(false);

export async function fetchPage(pageNumber: number, searchQuery: string | null): Promise<Post[]> {
	const res = await fetch(
		'/api/posts?' +
			new URLSearchParams({
				tags: searchQuery ?? '',
				page: pageNumber.toString(),
				postsPerPage: postsPerPage_value.toString()
			}),
		{
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		}
	);

	if (!res.ok) throw new Error('Failed to fetch data');

	const posts: Post[] = await res.json();

	if (posts.length === 0) allDataFetched.set(true);

	return posts.filter((post) => !isPostBlacklisted(post));
}

function isPostBlacklisted(post: Post): boolean {
	const tags = post.tags.map((tag) => tag.name);

	return blacklistedTags_value.some((blacklistedTag) => {
		const splitBlacklistedTags = blacklistedTag.split(' ');

		return splitBlacklistedTags.every((splitBlacklistedTag) => {
			let isNegated = false;
			if (splitBlacklistedTag.startsWith('-')) isNegated = true;

			return (
				isNegated !==
				tags.some((postTag) => {
					if (isNegated === true) splitBlacklistedTag = splitBlacklistedTag.replace(/-/g, '');

					if (splitBlacklistedTag.includes(':')) {
						const key = splitBlacklistedTag.split(':')[0];
						const value = splitBlacklistedTag.split(':')[1];

						if (key === 'rating') return value === post.rating;
						if (key === 'type') return value === post.extension;
					}

					return postTag === splitBlacklistedTag;
				})
			);
		});
	});
}
