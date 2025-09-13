import type { PageServerLoad } from './$types';
import { tmdbFetch, type TMDBItem, type MediaType } from '$lib/api/tmdb.server';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q');
	const genre = url.searchParams.get('genre');
	const year = url.searchParams.get('year');

	// Always fetch unfiltered data - filtering will be done client-side
	const popularPromise = q
		? tmdbFetch<{ results: TMDBItem[] }>('/search/multi', { query: q, include_adult: 0 })
		: tmdbFetch<{ results: TMDBItem[] }>('/trending/all/day');

	const recommendedPromise = tmdbFetch<{ results: TMDBItem[] }>('/discover/movie', {
		sort_by: 'vote_average.desc',
		'vote_count.gte': 100
	});

	const genresMovie = tmdbFetch<{ genres: { id: number; name: string }[] }>('/genre/movie/list');
	const genresTv = tmdbFetch<{ genres: { id: number; name: string }[] }>('/genre/tv/list');

	const [popular, recommended, gm, gt] = await Promise.all([
		popularPromise,
		recommendedPromise,
		genresMovie,
		genresTv
	]);

	// Merge genre lists (unique by id)
	const map = new Map<number, string>();
	for (const g of [...gm.genres, ...gt.genres]) map.set(g.id, g.name);
	const genres = Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));

	return {
		popular: popular.results.filter((r) => r.poster_path).slice(0, 50).map((m) => ({
			...m,
			media_type: (m.media_type || 'movie') as MediaType
		})),
		recommended: recommended.results.filter((r) => r.poster_path).slice(0, 50).map((m) => ({ ...m, media_type: 'movie' as MediaType })),
		genres,
		q: q ?? '',
		isMock: !env.TMDB_API_KEY
	};
};
