import { writable } from 'svelte/store';

export const posts = writable([]);
export const allDataFetched = writable(false);

const POSTS_PER_REQUEST = 25;

export async function fetchPage(pageNumber, searchQuery) {
	let url = `https://e621.net/posts.json?limit=${POSTS_PER_REQUEST}`;

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
