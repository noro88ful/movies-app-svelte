import { writable } from 'svelte/store';

interface NavbarState {
    showFilter: boolean;
    hasActiveFilters: boolean;
    genres: any[];
    selectedGenre: number | null;
    selectedYear: number | null;
}

export const navbarState = writable<NavbarState>({
    showFilter: false,
    hasActiveFilters: false,
    genres: [],
    selectedGenre: null,
    selectedYear: null
});

export function updateNavbarState(state: Partial<NavbarState>) {
    navbarState.update(current => ({ ...current, ...state }));
}

export function toggleFilter() {
    navbarState.update(state => ({ ...state, showFilter: !state.showFilter }));
}