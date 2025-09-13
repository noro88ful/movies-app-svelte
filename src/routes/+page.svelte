<script lang="ts">
	import Carousel from '$lib/components/Carousel.svelte';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import { useFiltered } from '$lib/utils';
	import { page } from '$app/stores';
	import { navbarState, updateNavbarState, toggleFilter } from '$lib/stores/navbar';
	import { goto } from '$app/navigation';

	interface PageData {
		popular: any[];
		recommended: any[];
		genres: any[];
		q: string;
		isMock?: boolean;
	}
	let { data }: { data: PageData } = $props();

	// Make data destructuring reactive to prop changes
	const popular = $derived(data.popular);
	const recommended = $derived(data.recommended);
	const genres = $derived(data.genres);
	const q = $derived(data.q);

	let query = $state('');

	// Keep query in sync with URL/server data
	$effect(() => {
		query = q;
	});

	// Get current filter values from URL params (reactive to URL changes)
	const currentGenre = $derived($page.url.searchParams.get('genre'));
	const currentYear = $derived($page.url.searchParams.get('year'));

	const selectedGenre = $derived(currentGenre ? Number(currentGenre) : null);
	const selectedYear = $derived(currentYear ? Number(currentYear) : null);

	// Check if any filters are active
	const hasActiveFilters = $derived(selectedGenre !== null || selectedYear !== null);

	// Apply client-side filtering
	const filteredPopular = $derived(
		useFiltered(popular, selectedGenre ?? 'all', selectedYear ?? 'all')
	);

	const filteredRecommended = $derived(
		useFiltered(recommended, selectedGenre ?? 'all', selectedYear ?? 'all')
	);

	const popularLabel = $derived(
		q ? 'Search Results' : hasActiveFilters ? 'Filtered Results' : 'Popular'
	);
	const recommendedLabel = $derived(hasActiveFilters ? 'Top Rated' : 'Recommended');

	// Update navbar state when data changes
	$effect(() => {
		updateNavbarState({
			genres,
			selectedGenre,
			selectedYear,
			hasActiveFilters
		});
	});

	// Auto-show filter bar when filters are active
	$effect(() => {
		if (hasActiveFilters && !$navbarState.showFilter) {
			updateNavbarState({ showFilter: true });
		}
	});

	function onSubmit(e: Event) {
		e.preventDefault();
		const params = new URLSearchParams(location.search);
		if (query) params.set('q', query);
		else params.delete('q');
		goto(`/?${params.toString()}`);
	}
</script>

<section class="space-y-6">
	{#if data.isMock}
		<div
			class="mb-4 flex animate-pulse items-center gap-3 rounded-lg border-2 border-red-500 bg-red-50/80 p-4 shadow-lg"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 flex-shrink-0 text-red-600"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
				/></svg
			>
			<span class="text-base font-semibold text-red-700">
				<strong>Notice:</strong> For live movie data, please provide your TMDB API key.<br />
				<span class="text-sm font-normal text-red-600"
					>You are currently viewing mock data. Enter a valid TMDB key to enable real-time content.</span
				>
			</span>
		</div>
	{/if}
	<!-- Search Bar -->
	<form
		class={`relative mx-auto w-[345px] gap-2${!$navbarState.showFilter ? ' mb-12' : ''}`}
		onsubmit={onSubmit}
	>
		<input
			class="h-12 w-full rounded-xl bg-[#131316] p-4 pl-11 text-sm text-white placeholder-[#575B66] outline-none ring-1 ring-white/10 focus:ring-brand"
			placeholder="Search"
			bind:value={query}
		/>
		<button class="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" aria-label="Search">
			<img src="/svg/search.svg" alt="Search" />
		</button>
		<button
			onclick={toggleFilter}
			class="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
			aria-label="Filter"
		>
			<img src="/svg/filter.svg" alt="Filter" />
		</button>
	</form>

	{#if $navbarState.showFilter}
		<FilterBar {genres} {selectedGenre} {selectedYear} />
	{/if}

	<Carousel label={popularLabel}>
		{#each filteredPopular as item (item.id)}
			<MovieCard {item} />
		{/each}
	</Carousel>

	<Carousel label={recommendedLabel}>
		{#each filteredRecommended as item (item.id)}
			<MovieCard {item} />
		{/each}
	</Carousel>
</section>
