<script lang="ts">
	import { imgUrl, displayTitle, type TMDBItem } from '$lib/api/tmdb';
	import RatingStars from './RatingStars.svelte';
	import HeartIcon from './HeartIcon.svelte';

	let { item }: { item: TMDBItem } = $props();
	let type = (item.media_type as 'movie' | 'tv') ?? 'movie';
	const title = displayTitle(item);
	const href = `/title/${type}/${item.id}`;
</script>

<div class="group relative w-[150px]">
	<a class="block" {href}>
		<div class="relative overflow-hidden rounded-[8px]">
			<img
				src={imgUrl(item.poster_path, 'w342')}
				alt={title}
				class="aspect-[2/3] h-[217px] min-w-[150px] object-cover transition-transform duration-300 group-hover:scale-105"
				loading="lazy"
			/>
			<div
				class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"
			></div>
		</div>
		<div class="mt-2 px-0.5">
			<p class="truncate text-center text-sm font-medium text-white">{title}</p>
			<div class="mt-1 flex items-center justify-center gap-2">
				<RatingStars rating={item.vote_average} />
			</div>
		</div>
	</a>

	<!-- Heart icon overlay -->
	<div
		class="absolute right-1 top-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
	>
		<HeartIcon {item} {title} details={{}} size="sm" class="bg-black/50 backdrop-blur" />
	</div>
</div>
