<script lang="ts">
	import { getFavoritesFromStorage, type FavoriteItem } from '$lib/utils.js';
	import { imgUrl } from '$lib/api/tmdb';
	import HeartIcon from '$lib/components/HeartIcon.svelte';
	import { browser } from '$app/environment';

	let favorites: FavoriteItem[] = $state([]);

	// Load favorites from localStorage
	function loadFavorites() {
		if (browser) {
			favorites = getFavoritesFromStorage();
		}
	}

	// Listen for storage changes to update favorites in real-time
	function handleStorageChange(event: StorageEvent) {
		if (event.key === 'movieFavorites') {
			loadFavorites();
		}
	}

	// Load favorites on component mount and set up storage listener
	if (browser) {
		loadFavorites();

		// Listen for storage changes from other tabs/windows
		window.addEventListener('storage', handleStorageChange);

		// Listen for custom events from within the same tab
		window.addEventListener('favoritesChanged', loadFavorites);

		// Cleanup listeners on component destroy
		$effect(() => {
			return () => {
				window.removeEventListener('storage', handleStorageChange);
				window.removeEventListener('favoritesChanged', loadFavorites);
			};
		});
	}
</script>

<svelte:head>
	<title>My Favorites - Movies App</title>
</svelte:head>

<div class="container-px py-8">
	{#if favorites.length === 0}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="mb-4 h-16 w-16 text-white/30"
			>
				<path
					d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
				/>
			</svg>
			<h2 class="mb-2 text-xl font-semibold text-white/70">No favorites yet</h2>
			<p class="text-white/50">Start adding movies and TV shows to your favorites!</p>
			<a
				href="/"
				class="mt-4 inline-block rounded-lg bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700"
			>
				Browse Movies
			</a>
		</div>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each favorites as favorite (favorite.id)}
				<div
					class="group relative overflow-hidden rounded-lg bg-white/5 transition-all duration-200 hover:bg-white/10"
				>
					<a href="/title/{favorite.media_type}/{favorite.id}" class="block">
						<div class="aspect-[2/3] overflow-hidden">
							<img
								src={favorite.poster_path
									? imgUrl(favorite.poster_path, 'w342')
									: 'https://via.placeholder.com/342x513?text=No+Image'}
								alt={favorite.title}
								class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
							/>
						</div>
						<div class="p-4">
							<h3 class="mb-2 line-clamp-2 text-sm font-semibold">{favorite.title}</h3>
							<div class="mb-2 flex items-center gap-2">
								<div class="flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										class="h-4 w-4 text-yellow-400"
									>
										<path
											d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.066 4.186a.563.563 0 0 0 .424.308l4.62.671c.382.055.534.525.258.795l-3.343 3.26a.563.563 0 0 0-.162.498l.789 4.6a.562.562 0 0 1-.816.592l-4.13-2.17a.563.563 0 0 0-.524 0l-4.13 2.17a.562.562 0 0 1-.816-.592l.79-4.6a.562.562 0 0 0-.162-.498l-3.343-3.26a.563.563 0 0 1 .258-.794l4.62-.672a.563.563 0 0 0 .424-.307l2.066-4.186Z"
										/>
									</svg>
									<span class="text-xs text-white/70">{favorite.vote_average.toFixed(1)}</span>
								</div>
								<span class="badge text-xs">
									{favorite.media_type === 'movie' ? 'Movie' : 'TV Show'}
								</span>
							</div>
							{#if favorite.release_date}
								<p class="text-xs text-white/50">
									{new Date(favorite.release_date).getFullYear()}
								</p>
							{/if}
						</div>
					</a>

					<!-- Heart icon overlay -->
					<div class="absolute right-2 top-2">
						<HeartIcon
							item={favorite}
							title={favorite.title}
							details={{ overview: favorite.overview }}
							size="sm"
							class="bg-black/50 backdrop-blur"
						/>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
