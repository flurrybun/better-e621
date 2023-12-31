import type { e621Post, Post, File } from '$lib/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const tags = url.searchParams.get('tags') ?? '';
	const pageNumber = url.searchParams.get('page') ?? '';
	const postsPerPage = url.searchParams.get('postsPerPage') ?? '';

	const response = await fetch(
		'https://e621.net/posts.json?' +
			new URLSearchParams({
				tags: tags,
				limit: postsPerPage,
				page: pageNumber
			}),
		{
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				'User-Agent': 'better-e621/prerelease (by flurrybun)'
			}
		}
	);

	const res = await response.json();
	const posts: e621Post[] = res.posts;

	const parsedPosts: Post[] = posts
		.filter((post) => post.file.url !== null)
		.map((post) => {
			const fileType =
				post.file.ext === 'swf' ? 'flash' : post.file.ext === 'webm' ? 'video' : 'image';

			let files: File[] = [];

			if (fileType === 'video') {
				files = Object.values(post.sample.alternates).map((video) => {
					return {
						width: video.width,
						height: video.height,
						url: new URL(video.urls.find((url) => url !== null) ?? '')
					};
				});
			} else if (fileType === 'image') {
				files = [
					{
						width: post.preview.width,
						height: post.preview.height,
						url: new URL(post.preview.url)
					},
					{
						width: post.sample.width,
						height: post.sample.height,
						url: new URL(post.sample.url)
					},
					{
						width: post.file.width,
						height: post.file.height,
						url: new URL(post.file.url)
					}
				];
			} else {
				files = [
					{
						width: post.file.width,
						height: post.file.height,
						url: new URL(post.file.url)
					}
				];
			}

			return {
				id: post.id,
				type: fileType,
				extension: post.file.ext,
				files: files,
				thumbnail: new URL(post.sample.url),
				tags: Object.entries(post.tags).flatMap(([category, values]) =>
					values.map((name) => ({ name, category }))
				),
				rating: post.rating,
				score: post.score.total,
				vote: null,
				favoriteCount: post.fav_count,
				isFavorited: post.is_favorited
			};
		});

	return json(parsedPosts);
};
