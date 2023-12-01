import { writable } from 'svelte/store';
import { browser } from '$app/environment';

let initialBlacklistedTags = [];

if (browser) {
	if (localStorage.getItem('blacklistedTags') !== null) {
		initialBlacklistedTags = localStorage
			.getItem('blacklistedTags')
			.split(',')
			.filter((tag) => tag !== '');
	} else {
		initialBlacklistedTags = ['young -rating:s', 'gore', 'scat', 'watersports', 'loli', 'shota'];
	}
}

export const postsPerPage = writable(50);
export const blacklistedTags = writable(initialBlacklistedTags);

blacklistedTags.subscribe((value) => {
	if (browser) localStorage.setItem('blacklistedTags', value);
});
