export type e621Post = {
	id: number;
	created_at: string;
	updated_at: string;
	file: {
		width: number;
		height: number;
		ext: 'png' | 'jpg' | 'gif' | 'webm' | 'swf';
		size: number;
		md5: string;
		url: string;
	};
	preview: {
		width: number;
		height: number;
		url: string;
	};
	sample: {
		has: boolean;
		height: number;
		width: number;
		url: string;
		alternates: {
			[key: string]: {
				type: string;
				height: number;
				width: number;
				urls: (string | null)[];
			};
		};
	};
	score: {
		up: number;
		down: number;
		total: number;
	};
	tags: {
		general: string[];
		artist: string[];
		copyright: string[];
		character: string[];
		species: string[];
		invalid: string[];
		meta: string[];
		lore: string[];
	};
	locked_tags: string[];
	change_seq: number;
	flags: {
		pending: boolean;
		flagged: boolean;
		note_locked: boolean;
		status_locked: boolean;
		rating_locked: boolean;
		deleted: boolean;
	};
	rating: 's' | 'q' | 'e';
	fav_count: number;
	sources: string[];
	pools: number[];
	relationships: {
		parent_id: number;
		has_children: boolean;
		has_active_children: boolean;
		children: number[];
	};
	approver_id: number;
	uploader_id: number;
	description: string;
	comment_count: number;
	is_favorited: boolean;
	has_notes: boolean;
	duration: number | null;
};

export type File = {
	width: number;
	height: number;
	url: URL;
};

export type Post = {
	id: number;
	type: 'image' | 'video' | 'flash';
	extension: 'png' | 'jpg' | 'gif' | 'webm' | 'swf';
	files: File[];
	thumbnail: URL;
	tags: {
		name: string;
		category: string;
	}[];
	rating: 's' | 'q' | 'e';
	score: number;
	vote: 'up' | 'down' | null;
	favoriteCount: number;
	isFavorited: boolean;
};

export type Tag = {
	id: number;
	name: string;
	post_count: number;
	related_tags: string;
	related_tags_updated_at: string;
	category: number;
	is_locked: boolean;
	created_at: string;
	updated_at: string;
};
