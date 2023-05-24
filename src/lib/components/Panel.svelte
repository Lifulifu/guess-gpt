<script>
	import { fade } from 'svelte/transition';
	export let show = false;
	export let closable = true;
</script>

{#if show}
	<div
		on:mousedown={() => {if (closable) show = false}}
		on:keydown
		class="inset-0 fixed flex items-center justify-center p-4 bg-black/50"
		transition:fade={{ duration: 100 }}
	>
		<div
			on:mousedown|stopPropagation
			on:keydown
			class="w-md text-center rounded-lg p-8 bg-slate-200"
		>
			<slot />
		</div>
	</div>
{/if}
