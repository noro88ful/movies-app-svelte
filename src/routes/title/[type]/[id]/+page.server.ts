import type { PageServerLoad } from './$types';
import { tmdbFetch, type MediaType, type TMDBItem } from '$lib/api/tmdb.server';

export const load: PageServerLoad = async ({ params }) => {
	const type = params.type as MediaType;
	const id = params.id;

	const details = tmdbFetch<any>(`/${type}/${id}`);
	const credits = tmdbFetch<{ cast: { id: number; name: string; profile_path: string | null; character: string }[] }>(`/${type}/${id}/credits`);
	const external = tmdbFetch<{ imdb_id?: string }>(`/${type}/${id}/external_ids`);

	const [d, c, e] = await Promise.all([details, credits, external]);

	const item: TMDBItem = {
		id: d.id,
		title: d.title,
		name: d.name,
		media_type: type,
		poster_path: d.poster_path,
		backdrop_path: d.backdrop_path,
		vote_average: d.vote_average,
		release_date: d.release_date,
		first_air_date: d.first_air_date
	};

	const runtime = d.runtime ?? (d.episode_run_time?.[0] ?? null);

	return { details: d, item, credits: c.cast.slice(0, 12), imdb: e.imdb_id ?? null, runtime };
};
