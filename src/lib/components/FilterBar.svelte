<script lang="ts">
	import { goto } from '$app/navigation';
	import CustomSelect from './CustomSelect.svelte';

	let {
		genres = [],
		selectedGenre = null,
		selectedYear = null
	}: {
		genres: { id: number; name: string }[];
		selectedGenre: number | null;
		selectedYear: number | null;
	} = $props();

	const years = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - i);

	// Transform genres to select options
	const genreOptions = $derived([
		{ value: '', label: 'All Genres' },
		...genres.map((g) => ({ value: g.id.toString(), label: g.name }))
	]);

	// Transform years to select options
	const yearOptions = $derived([
		{ value: '', label: 'Any Year' },
		...years.map((y) => ({ value: y.toString(), label: y.toString() }))
	]);

	function update(param: string, value: string) {
		const p = new URLSearchParams(location.search);
		if (value) p.set(param, value);
		else p.delete(param);
		goto(`/?${p.toString()}`);
	}
</script>

<div class="!mb-12 flex w-full flex-wrap items-center justify-center gap-3">
	<CustomSelect
		options={genreOptions}
		value={selectedGenre?.toString() || ''}
		placeholder="All Genres"
		onchange={(value) => update('genre', value)}
	/>

	<CustomSelect
		options={yearOptions}
		value={selectedYear?.toString() || ''}
		placeholder="Any Year"
		onchange={(value) => update('year', value)}
	/>
</div>
