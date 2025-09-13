export const IMG_BASE = 'https://image.tmdb.org/t/p/';
export const imgUrl = (path: string | null | undefined, size = 'w500') =>
	path ? `${IMG_BASE}${size}${path}` : '';

export type MediaType = 'movie' | 'tv';
export interface TMDBItem {
	id: number;
	title?: string;
	name?: string;
	media_type?: MediaType;
	poster_path: string | null;
	backdrop_path: string | null;
	vote_average: number;
	release_date?: string;
	first_air_date?: string;
	genre_ids?: number[];
}

export const displayTitle = (m: TMDBItem) => m.title ?? m.name ?? '';
export const displayDate = (m: TMDBItem) => m.release_date ?? m.first_air_date ?? '';
