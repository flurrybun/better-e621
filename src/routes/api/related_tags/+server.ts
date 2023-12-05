import { json } from '@sveltejs/kit';
import type { e621Tag, Tag } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	let searchedTags = url.searchParams.get('tags')?.split(',') ?? [];

	searchedTags = searchedTags.filter((tag) => {
		return !(tag.includes(':') || tag.includes('*') || tag.includes('-')) && tag !== '';
	});

	const data = await fetchTags(searchedTags);

	//convert space separated string with tag names and frequency to array of tag names
	//"a 100 b 200 c 300" -> ['a', 'b', 'c']
	const relatedTags = data.reduce((acc, tag) => {
		const individualRelatedTags = tag.related_tags
			.split(' ')
			.filter((tag, index) => index % 2 == 0 && !searchedTags.includes(tag));

		return [...acc, ...individualRelatedTags];
	}, [] as string[]);

	const data2 = await fetchTags(relatedTags.slice(0, 50));

	data2.sort((a, b) => {
		return b.post_count - a.post_count;
	});

	const formattedRelatedTags: Tag[] = data2.map((tag) => {
		const category = categoryMap[tag.category] || '';

		return {
			name: tag.name,
			id: tag.id,
			category: category,
			postCount: tag.post_count
		};
	});

	return json(formattedRelatedTags.slice(0, 20));
};

const fetchTags = async (tags: string[]): Promise<e621Tag[]> => {
	const params = new URLSearchParams();

	if (tags.length > 0) params.set('search[name]', tags.toString());
	else params.set('search[order]', 'count');

	const response = await fetch('https://e621.net/tags.json?' + params.toString(), {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'User-Agent': 'better-e621/prerelease (by flurrybun)'
		}
	});

	if (!response.ok) throw new Error('Failed to fetch tags');
	const result: e621Tag[] = await response.json();

	//e621 will return an object if no tags meet the search query
	if (!Array.isArray(result)) return [];

	return result;
};

const categoryMap: { [key: number]: string } = {
	0: 'general',
	1: 'artist',
	3: 'copyright',
	4: 'character',
	5: 'species',
	6: 'invalid',
	7: 'meta',
	8: 'lore'
};
