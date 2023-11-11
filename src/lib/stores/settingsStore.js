import { writable } from 'svelte/store';

//number of posts fetched from e621 for each fetch
export const postsPerPage = writable(50);
export const blacklistedTags = writable([
	'young -rating:s',
	'gore',
	'scat',
	'watersports',
	'loli',
	'shota'
]);
