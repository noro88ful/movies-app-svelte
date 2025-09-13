
import { env } from '$env/dynamic/private';
import * as mock from './tmdb.mock';

const TMDB_BASE = 'https://api.themoviedb.org/3';

function withKey(url: string, params: Record<string, string | number | undefined> = {}) {
	const sp = new URLSearchParams({
		api_key: env.TMDB_API_KEY ?? '', ...Object.fromEntries(
			Object.entries(params).filter(([, v]) => v !== undefined)
		)
	});
	return `${TMDB_BASE}${url}?${sp.toString()}`;
}


export async function tmdbFetch<T>(url: string, params: Record<string, string | number | undefined> = {}) {
	if (!env.TMDB_API_KEY) {
		// Return mock data for known endpoints
		if (url === '/trending/all/day') {
			// @ts-ignore
			return mock.mockPopular as T;
		}
		if (url === '/search/multi') {
			// Filter mockPopular by query if present
			const q = typeof params.query === 'string' ? params.query.toLowerCase() : '';

			let results = structuredClone(mock.mockPopular.results);
			if (q) {
				results = results.filter(item =>
					(item.title && item.title.toLowerCase().includes(q)) ||
					(item.name && item.name.toLowerCase().includes(q))
				);
			}
			console.log('Mock search results for query:', q, results);
			// @ts-ignore
			return { results } as T;
			// return { results } as T;
		}
		if (url === '/discover/movie') {
			// @ts-ignore
			return mock.mockRecommended as T;
		}
		if (url === '/genre/movie/list') {
			// @ts-ignore
			return mock.mockGenresMovie as T;
		}
		if (url === '/genre/tv/list') {
			// @ts-ignore
			return mock.mockGenresTv as T;
		}
		// Match any /movie/{id}, /movie/{id}/credits, /movie/{id}/external_ids
		const movieDetailsMatch = url.match(/^\/movie\/(\d+)$/);
		const movieCreditsMatch = url.match(/^\/movie\/(\d+)\/credits$/);
		const movieExternalMatch = url.match(/^\/movie\/(\d+)\/external_ids$/);
		if (movieDetailsMatch) {
			const id = movieDetailsMatch[1];
			if (id === '1321439') return mock.mockDetails as T;
			if (id === '1078605') return mock.mockDetails_1078605 as T;
			// fallback to first mock for others
			return mock.mockDetails_224414 as T;
		}
		if (movieCreditsMatch) {
			const id = movieCreditsMatch[1];
			if (id === '1321439') return mock.mockCredits as T;
			if (id === '1078605') return mock.mockCredits_1078605 as T;
			return mock.mockCredits_224414 as T;
		}
		if (movieExternalMatch) {
			const id = movieExternalMatch[1];
			if (id === '1321439') return mock.mockExternal as T;
			if (id === '1078605') return mock.mockExternal_1078605 as T;
			return mock.mockExternal_224414 as T;
		}
		// TV show details
		const tvDetailsMatch = url.match(/^\/tv\/(\d+)$/);
		const tvCreditsMatch = url.match(/^\/tv\/(\d+)\/credits$/);
		const tvExternalMatch = url.match(/^\/tv\/(\d+)\/external_ids$/);
		if (tvDetailsMatch) {
			return mock.mockDetails_224414 as T;
		}
		if (tvCreditsMatch) {
			return mock.mockCredits_224414 as T;
		}
		if (tvExternalMatch) {
			return mock.mockExternal_224414 as T;
		}
		// For other endpoints, throw a custom error
		throw new Error('TMDB_API_KEY missing. No mock data for this endpoint.');
	}
	const res = await fetch(withKey(url, params));
	if (!res.ok) throw new Error(`TMDB error ${res.status}`);
	return (await res.json()) as T;
}

export * from './tmdb';
