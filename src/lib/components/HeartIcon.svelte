<script lang="ts">
	import { isItemFavorite, toggleFavoriteItem } from '$lib/utils.js';
	import { browser } from '$app/environment';
	import type { TMDBItem } from '$lib/api/tmdb.js';

	interface Props {
		item?: TMDBItem;
		title?: string;
		details?: { overview?: string; title?: string };
		size?: 'sm' | 'md' | 'lg';
		showTooltip?: boolean;
		class?: string;
		disabled?: boolean;
	}

	let {
		item,
		title,
		details = {},
		size = 'md',
		showTooltip = true,
		class: className = '',
		disabled = false
	}: Props = $props();

	let isFavorite = $state(false);

	// Size classes
	const sizeClasses = {
		sm: 'h-5 w-5',
		md: 'h-6 w-6',
		lg: 'h-8 w-8'
	};

	const buttonSizeClasses = {
		sm: 'p-1',
		md: 'p-1.5',
		lg: 'p-2'
	};

	function checkIsFavorite() {
		if (browser && item && title) {
			isFavorite = isItemFavorite(item, title);
		}
	}

	function handleToggle() {
		if (browser && item && title && !disabled) {
			isFavorite = toggleFavoriteItem(item, title, details);
		}
	}

	// Initialize favorite status
	if (browser && item && title) {
		checkIsFavorite();
	}
</script>

<button
	onclick={handleToggle}
	class="group rounded-full transition-all duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/50 {buttonSizeClasses[
		size
	]} {className} {disabled || !item || !title ? 'cursor-not-allowed opacity-50' : ''}"
	aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
	title={showTooltip ? (isFavorite ? 'Remove from favorites' : 'Add to favorites') : undefined}
	{disabled}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		class="transition-all duration-200 {sizeClasses[size]} {isFavorite
			? 'fill-red-500 text-red-500'
			: 'fill-none text-white/70 group-hover:text-red-400'}"
		stroke="currentColor"
		stroke-width="2"
	>
		<path
			d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
		/>
	</svg>
</button>
