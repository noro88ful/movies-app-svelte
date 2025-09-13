import type { TMDBItem } from './api/tmdb';

export function useFiltered(
    list: TMDBItem[],
    genreId: number | "all",
    year: number | "all"
): TMDBItem[] {
    return list.filter((m) => {
        const y = (m.release_date || m.first_air_date || "").slice(0, 4);
        const okYear = year === "all" || y === String(year);
        const okGenre = genreId === "all" || (m.genre_ids || []).includes(genreId);
        return okYear && okGenre;
    });
}

// Rating utilities
export type ICallBack = (value: number) => void;
export const ICallBackValue: ICallBack = () => { };

export function getStarTypes(rating: number, maxStars: number = 5): string[] {
    const stars: string[] = [];
    const normalizedRating = Math.max(0, Math.min(maxStars * 2, rating)); // Clamp between 0 and maxStars*2

    for (let i = 0; i < maxStars; i++) {
        const starValue = i * 2;
        if (normalizedRating >= starValue + 2) {
            stars.push('full');
        } else if (normalizedRating >= starValue + 1) {
            stars.push('half');
        } else {
            stars.push('empty');
        }
    }

    return stars;
}

export function convertedTime(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
}

// Favorites utilities
export interface FavoriteItem {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
    media_type: 'movie' | 'tv';
    overview: string;
}

export function getFavoritesFromStorage(): FavoriteItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem('movieFavorites');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function saveFavoritesToStorage(favorites: FavoriteItem[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('movieFavorites', JSON.stringify(favorites));
        // Dispatch custom event to notify components of changes
        window.dispatchEvent(new CustomEvent('favoritesChanged'));
    } catch (error) {
        console.error('Failed to save favorites:', error);
    }
}

export function isItemFavorite(item: Pick<TMDBItem, 'id' | 'media_type'>, title?: string): boolean {
    const favorites = getFavoritesFromStorage();
    const mediaType = item.media_type || (title ? 'movie' : 'tv');
    return favorites.some(fav => fav.id === item.id && fav.media_type === mediaType);
}

export function toggleFavoriteItem(item: TMDBItem, title: string, details: { overview?: string; title?: string } = {}): boolean {
    const favorites = getFavoritesFromStorage();
    const movieData: FavoriteItem = {
        id: item.id,
        title: title,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date || '',
        media_type: item.media_type || (details.title ? 'movie' : 'tv'),
        overview: details.overview || ''
    };

    const existingIndex = favorites.findIndex(
        fav => fav.id === item.id && fav.media_type === movieData.media_type
    );

    if (existingIndex !== -1) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        saveFavoritesToStorage(favorites);
        return false;
    } else {
        // Add to favorites
        favorites.push(movieData);
        saveFavoritesToStorage(favorites);
        return true;
    }
}