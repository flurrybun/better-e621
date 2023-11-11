import { writable } from 'svelte/store';
import { postsPerPage, blacklistedTags } from '$lib/stores/settingsStore.js';

let postsPerPage_value;
let blacklistedTags_value;

postsPerPage.subscribe((value) => {
	postsPerPage_value = value;
});

blacklistedTags.subscribe((value) => {
	blacklistedTags_value = value;
});

export const posts = writable([]);
export const allDataFetched = writable(false);

export async function fetchPage(pageNumber, searchQuery) {
	let url = `https://e621.net/posts.json?limit=${postsPerPage_value}`;

	if (searchQuery !== null) url += `&tags=${encodeURIComponent(searchQuery)}`;
	url += `&page=${pageNumber}`;

	const res = await fetch(url);

	if (res.ok) {
		const data = await res.json();

		if (data.posts.length === 0) {
			allDataFetched.set(true);
		}

		const posts = data.posts.filter((post) => !isPostBlacklisted(post));

		return posts;
	}

	throw new Error('Failed to fetch data');
}

function isPostBlacklisted(post) {
	const postTags = Object.values(post.tags).reduce((acc, arr) => acc.concat(arr), []);

	//if at least one blacklist matches, then the post is blacklisted
	return blacklistedTags_value.some((blacklistedTag) => {
		const splitBlacklistedTags = blacklistedTag.split(' ');

		//every tag inside a single blacklist must be true in order for the post to be blacklisted
		//e.g. for the blacklist 'male solo', the post must have male AND solo in order to be blacklisted
		return splitBlacklistedTags.every((splitBlacklistedTag) => {
			//invert result if tag starts with a minus sign
			let isNegated = false;
			if (splitBlacklistedTag.startsWith('-')) isNegated = true;

			//check blacklist tag against the post's tags
			return (
				isNegated !==
				postTags.some((postTag) => {
					if (isNegated === true) splitBlacklistedTag = splitBlacklistedTag.replace(/-/g, '');

					//catch special cases such as rating:s or type:webm
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
