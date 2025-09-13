<script lang="ts">
	import { goto } from '$app/navigation';

	interface Props {
		text?: string;
		onclick?: () => void;
	}

	let { text = '', onclick }: Props = $props();

	function handleClick() {
		if (onclick) {
			onclick();
		} else {
			goto('/');
		}
	}
</script>

<button onclick={handleClick} aria-label="Go back" class="flex items-center gap-2 text-white">
	<img src="/svg/arrow-back.svg" alt="Go back" />
	{#if text}
		<span class="text-sm font-medium">{text}</span>
	{/if}
</button>
