import { writable } from 'svelte/store';
import { postsPerPage } from '$lib/stores/settingsStore.js';

let postsPerPage_value;

postsPerPage.subscribe((value) => {
	postsPerPage_value = value;
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

		return data.posts;
	}

	throw new Error('Failed to fetch data');
}
