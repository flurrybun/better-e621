import { blacklistedTags, postsPerPage } from '$lib/stores/settingsStore';
import type { Post } from '$lib/types';
import { writable } from 'svelte/store';

let postsPerPage_value: number;
let blacklistedTags_value: string[];

postsPerPage.subscribe((value) => {
	postsPerPage_value = value;
});

blacklistedTags.subscribe((value) => {
	blacklistedTags_value = value;
});

export const posts = writable([]);
export const allDataFetched = writable(false);

export async function fetchPage(pageNumber: number, searchQuery: string | null): Promise<Post[]> {
	let url = `https://e621.net/posts.json?limit=${postsPerPage_value}`;

	if (searchQuery !== null) url += `&tags=${encodeURIComponent(searchQuery)}`;
	url += `&page=${pageNumber}`;

	const res = await fetch(url);

	if (res.ok) {
		const data: { posts: Post[] } = await res.json();

		if (data.posts.length === 0) {
			allDataFetched.set(true);
		}

		const posts = data.posts.filter((post) => !isPostBlacklisted(post));

		return posts;
	}

	throw new Error('Failed to fetch data');
}

function isPostBlacklisted(post: Post): boolean {
	const postTags = Object.values(post.tags).reduce((acc, arr) => acc.concat(arr), []);

	return blacklistedTags_value.some((blacklistedTag) => {
		const splitBlacklistedTags = blacklistedTag.split(' ');

		return splitBlacklistedTags.every((splitBlacklistedTag) => {
			let isNegated = false;
			if (splitBlacklistedTag.startsWith('-')) isNegated = true;

			return (
				isNegated !==
				postTags.some((postTag) => {
					if (isNegated === true) splitBlacklistedTag = splitBlacklistedTag.replace(/-/g, '');

					if (splitBlacklistedTag.includes(':')) {
						const key = splitBlacklistedTag.split(':')[0];
						const value = splitBlacklistedTag.split(':')[1];

						if (key === 'rating') return value === post.rating;
						if (key === 'type') return value === post.file.ext;
					}

					return postTag === splitBlacklistedTag;
				})
			);
		});
	});
}
