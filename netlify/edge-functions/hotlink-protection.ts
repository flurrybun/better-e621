import type { Context } from 'https://edge.netlify.com';

export default async (request: Request, context: Context): Promise<Response> => {
	const referer = request.headers.get('referer');

	const regex = /^https?:\/\/(.*\.)?bettere621\.net(\/.*)?$/;

	if (!referer || !regex.test(referer)) {
		return new Response('Forbidden', { status: 403 });
	}

	const response = await context.next();
	return response;
};
