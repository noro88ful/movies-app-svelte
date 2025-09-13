<script lang="ts">
	import { page } from '$app/stores';
	import { navbarState } from '$lib/stores/navbar';
	import BackButton from './BackButton.svelte';

	// Determine if we're on the movie detail page
	const isMovieDetailPage = $derived($page.route.id?.includes('/title/[type]/[id]'));
	// Determine if we're on the favorites page
	const isFavoritesPage = $derived($page.route.id?.includes('/favorites'));

	function share() {
		if (navigator.share) {
			navigator.share({
				title: document.title,
				url: window.location.href
			});
		}
	}
</script>

<header class="sticky top-0 z-30 {isMovieDetailPage ? '' : 'backdrop-blur'}">
	{#if isMovieDetailPage}
		<!-- Movie Detail Page Navbar -->
		<div class="container-px container flex h-16 items-center justify-between">
			<BackButton />

			<div class="flex items-center gap-3">
				<!-- Share Button -->
				<button
					onclick={share}
					aria-label="Share"
					class="flex items-center gap-2 text-white/70 hover:text-white"
				>
					<img src="/svg/share.svg" alt="Share" />
				</button>
			</div>
		</div>
	{:else if isFavoritesPage}
		<!-- Favorites Page Navbar -->
		<div class="container-px container flex h-16 items-center justify-between">
			<BackButton />

			<h1 class="text-lg font-semibold">My Favorites</h1>

			<div class="w-[20px]"><!-- Spacer to center the title --></div>
		</div>
	{:else}
		<!-- Home Page Navbar -->
		<div class="container-px container px-4 py-4">
			<!-- User Info + Actions -->
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<img
						src="/svg/avatar.svg"
						alt="User"
						class="h-10 w-10 rounded-full ring-2 ring-white/10"
					/>
					<div class="ml-3 flex flex-col">
						<p class="text-[12px] text-white/60">Welcome back</p>
						<h1 class="text-[16px] font-semibold tracking-tight">John Doe</h1>
					</div>
				</div>

				<div class="flex items-center gap-3">
					<!-- Favorites Button -->
					<a
						href="/favorites"
						class="flex items-center justify-center rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
						aria-label="My Favorites"
						title="My Favorites"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="h-6 w-6 text-red-500"
						>
							<path
								d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
							/>
						</svg>
					</a>

					<!-- Menu Button -->
					<button
						type="button"
						class="relative h-full cursor-pointer border-0 bg-transparent p-0 outline-none"
					>
						<img src="/svg/menu.svg" class="mb-2" alt="Filter" />
						{#if $navbarState.hasActiveFilters}
							<div
								class="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white/20"
							></div>
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/if}
</header>
