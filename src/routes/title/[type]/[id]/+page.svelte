<script lang="ts">
	import { imgUrl, displayTitle, displayDate } from '$lib/api/tmdb';
	import RatingStars from '$lib/components/RatingStars.svelte';
	import HeartIcon from '$lib/components/HeartIcon.svelte';
	import { convertedTime } from '$lib/utils.js';

	let { data } = $props();
	const { item, details, credits, imdb, runtime } = data;
	const title = displayTitle(item);
	const year = (displayDate(item) || '').slice(0, 4);
	let showFullOverview = $state(false);
</script>

<article class="overflow-hidden">
	<div class="absolute left-[0vw] top-[0vh] min-h-[420px] w-full select-none">
		<img
			src={imgUrl(item.backdrop_path || item.poster_path, 'w1280')}
			alt={title}
			class="h-[420px] w-full object-cover"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent"></div>
		<button
			class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full p-1 text-white shadow-soft backdrop-blur hover:animate-none"
			aria-label="Play trailer"
		>
			<img src="/svg/play.svg" alt="Play trailer" />
		</button>
		<span class="absolute bottom-3 right-4"
			>{#if runtime}<span>{convertedTime(runtime)}</span>{/if}</span
		>
	</div>

	<div class="mt-[320px] grid gap-6 py-8 sm:grid-cols-3 sm:py-8">
		<div class="sm:col-span-2">
			<div class="mb-5 flex w-full items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="badge rounded-[10px] px-5">{details.adult ? '+18' : 'PG'}</span>
					{#if details.genres?.[0]}<span class="badge rounded-[10px] px-5"
							>{details.genres[0].name}</span
						>{/if}
					<span class="badge inline-flex items-center gap-1 rounded-[10px] px-5"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="h-4 w-4 text-brand"
							><path
								d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.066 4.186a.563.563 0 0 0 .424.308l4.62.671c.382.055.534.525.258.795l-3.343 3.26a.563.563 0 0 0-.162.498l.789 4.6a.562.562 0 0 1-.816.592l-4.13-2.17a.563.563 0 0 0-.524 0l-4.13 2.17a.562.562 0 0 1-.816-.592l.79-4.6a.562.562 0 0 0-.162-.498l-3.343-3.26a.563.563 0 0 1 .258-.794l4.62-.672a.563.563 0 0 0 .424-.307l2.066-4.186Z"
							/></svg
						>{(item.vote_average ?? 0).toFixed(1)}</span
					>
				</div>
				<HeartIcon {item} {title} {details} size="md" class="flex-shrink-0" />
			</div>

			<div class="flex items-start justify-between gap-4">
				<h1 class="text-2xl font-semibold sm:text-3xl">{title} {year ? `(${year})` : ''}</h1>
			</div>
			{#if details.overview}
				{@const sentences = details.overview.split('.').filter((s: string) => s.trim())}
				{@const isLong = sentences.length > 2}
				<p class="mt-2 text-white/70 {isLong && !showFullOverview ? 'line-clamp-3' : ''}">
					{isLong && !showFullOverview ? sentences.slice(0, 2).join('.') + '.' : details.overview}
				</p>
				{#if isLong}
					<button
						class="mt-1 text-sm font-black text-[#FF0000] hover:text-[#FF4444]"
						onclick={() => (showFullOverview = !showFullOverview)}
					>
						{showFullOverview ? 'Show less' : 'Show more'}
					</button>
				{/if}
			{/if}
		</div>
		<div class="min-w-0 space-y-3">
			<h3 class="font-medium">Actors</h3>
			<div class="horizontal-scroll min-w-0">
				{#each credits as p}
					<div class="w-[108px] flex-shrink-0">
						<img
							src={p.profile_path
								? imgUrl(p.profile_path, 'w185')
								: 'https://via.placeholder.com/185x278?text=No+Image'}
							alt={p.name}
							class="h-[108px] w-[108px] rounded-lg object-cover"
						/>
						<p class="mt-1 w-[108px] truncate text-center text-sm">{p.name}</p>
						<p class="w-[108px] truncate text-center text-xs text-white/60">{p.character}</p>
					</div>
				{/each}
			</div>
			{#if imdb}
				<a
					class="btn-primary mt-4 w-full"
					href={`https://www.imdb.com/title/${imdb}/`}
					target="_blank"
					rel="noopener">Open IMDb</a
				>
			{/if}
		</div>
	</div>
</article>
