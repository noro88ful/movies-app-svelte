<script lang="ts">
	let { label = '', children } = $props();
</script>

<div class="relative !mb-14">
	<div class="mb-7 flex items-center justify-between">
		<h2 class="section-title mb-0">{label}</h2>
		<!-- TODO: In the future, this button will open a new page showing specific category movies -->
		<button type="button" class="cursor-pointer">
			<img src="/svg/arrow.svg" alt="More" />
		</button>
	</div>
	<div class="horizontal-scroll !pb-5">
		{@render children()}
	</div>
</div>
