<script lang="ts">
	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		options: Option[];
		value?: string;
		placeholder?: string;
		onchange?: (value: string) => void;
	}

	let { options = [], value = '', placeholder = 'Select option', onchange }: Props = $props();

	let isOpen = $state(false);
	let selectRef: HTMLDivElement;

	const selectedOption = $derived(options.find((opt) => opt.value === value));

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectOption(option: Option) {
		isOpen = false;
		onchange?.(option.value);
	}

	function handleClickOutside(event: MouseEvent) {
		if (selectRef && !selectRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}

	// Close dropdown when clicking outside
	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			document.addEventListener('keydown', handleKeydown);
		} else {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="relative" bind:this={selectRef}>
	<button
		type="button"
		onclick={toggleDropdown}
		class="group flex w-full min-w-[180px] items-center justify-between rounded-xl bg-[#131316] px-4 py-2.5 text-sm text-white outline-none ring-1 ring-white/10 transition-all duration-200 hover:bg-white/10 focus:ring-2 focus:ring-blue-500"
		aria-haspopup="listbox"
		aria-expanded={isOpen}
	>
		<span class="truncate">
			{selectedOption?.label || placeholder}
		</span>
		<div class="ml-2 flex h-4 w-4 items-center justify-center">
			<svg
				class="h-3 w-3 transition-all duration-200 group-hover:text-white/80 {isOpen
					? 'rotate-180'
					: ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				stroke-width="2.5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</div>
	</button>

	{#if isOpen}
		<div
			class="absolute top-full z-50 mt-1 w-full rounded-xl bg-[#1a1a1e] shadow-lg ring-1 ring-white/10 backdrop-blur-sm"
			role="listbox"
		>
			<div class="max-h-60 overflow-auto py-1">
				{#each options as option (option.value)}
					<button
						type="button"
						onclick={() => selectOption(option)}
						class="flex w-full items-center px-4 py-2.5 text-sm text-white transition-colors duration-150 hover:bg-white/10 {value ===
						option.value
							? 'bg-blue-500/20 text-blue-400'
							: ''}"
						role="option"
						aria-selected={value === option.value}
					>
						<span class="truncate">{option.label}</span>
						{#if value === option.value}
							<svg
								class="ml-auto h-4 w-4 text-blue-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
