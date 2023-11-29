import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const defaultBlacklistedTags = ['young -rating:s', 'gore', 'scat', 'watersports', 'loli', 'shota'];
const localBlacklistedTags = browser
	? localStorage.getItem('blacklistedTags').split(',') ?? defaultBlacklistedTags
	: defaultBlacklistedTags;

export const postsPerPage = writable(50);
export const blacklistedTags = writable(localBlacklistedTags ?? defaultBlacklistedTags);

blacklistedTags.subscribe((value) => {
	if (browser) localStorage.setItem('blacklistedTags', value);
});
