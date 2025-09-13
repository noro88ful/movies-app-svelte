<script lang="ts">
	import Star from './Star.svelte';
	import { getStarTypes, ICallBackValue, type ICallBack } from '$lib/utils';

	interface Props {
		rating?: number;
		onClick?: ICallBack;
		disabled?: boolean;
		isDark?: boolean;
	}

	let { rating = 0, onClick = ICallBackValue, disabled = false, isDark = false }: Props = $props();

	const returnStarValue = (type: string, count: number) => {
		switch (type) {
			case 'full':
				return onClick(count * 2 - 1);
			case 'half':
				return onClick(count * 2);
			case 'empty':
				return onClick(count * 2 - 1);
			default:
				return;
		}
	};

	const renderStars = () => {
		const maxStars = 5;
		const starTypes = getStarTypes(rating, maxStars);
		return starTypes.map((starType: string, idx: number) => ({
			type: starType,
			index: idx
		}));
	};

	const stars = $derived(renderStars());
	const starColor = $derived((starType: string) => {
		if (isDark) {
			return starType === 'empty' ? '#ffffff' : '#d2691e'; // chocolate color
		}
		return starType === 'empty' ? '#d1d5db' : '#FFFF00'; // gray-300 for empty, golden for filled
	});
</script>

<div
	class="flex h-full items-center justify-center"
	aria-label={`Rating ${rating}/10`}
	title={`Rating ${rating}/10`}
>
	{#each stars as { type, index }}
		<div
			class={`mx-0.5 inline-flex transition-all duration-300 ease-in-out ${
				disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'
			}`}
			role="button"
			tabindex={disabled ? -1 : 0}
			onclick={() => !disabled && returnStarValue(type, index + 1)}
			onkeydown={(e) => {
				if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
					e.preventDefault();
					returnStarValue(type, index + 1);
				}
			}}
		>
			<Star starType={type as 'full' | 'half' | 'empty'} color={starColor(type)} />
		</div>
	{/each}
</div>
