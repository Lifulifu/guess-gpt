<script>
	import { fade } from 'svelte/transition';
	export let show = false;
</script>

{#if show}
	<div
		on:click={() => (show = false)}
		on:keydown
		class="fixed inset-0 bg-black/50"
		transition:fade={{ duration: 100 }}
	>
		<div
			on:click|stopPropagation
			on:keydown
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md text-center rounded-lg p-8 bg-slate-200"
		>
			<slot />
		</div>
	</div>
{/if}
