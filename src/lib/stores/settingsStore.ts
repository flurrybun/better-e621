import { browser } from '$app/environment';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

let initialBlacklistedTags: string[] = [];

if (browser) {
	if (localStorage.getItem('blacklistedTags') !== null) {
		initialBlacklistedTags = (localStorage.getItem('blacklistedTags') || '')
			.split(',')
			.filter((tag) => tag !== '');
	} else {
		initialBlacklistedTags = ['young -rating:s', 'gore', 'scat', 'watersports', 'loli', 'shota'];
	}
}

export const postsPerPage: Writable<number> = writable(50);
export const blacklistedTags: Writable<string[]> = writable(initialBlacklistedTags);

blacklistedTags.subscribe((value) => {
	if (browser) localStorage.setItem('blacklistedTags', value.toString());
});
