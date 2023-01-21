<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	export let show: boolean = false;
	export let win: boolean = false;
	export let questionCount: number = 0;

	const dispatch = createEventDispatcher();

	function reveal() {
		dispatch('reveal');
		show = false;
	}

	function continueGuess() {
		dispatch('continue');
		show = false;
	}
</script>

{#if show}
	<div on:click={() => (show = false)} on:keydown class="fixed inset-0 bg-black/50">
		<div
			on:click|stopPropagation
			on:keydown
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md text-center rounded-lg p-8 bg-slate-200"
		>
			{#if win}
				<h2 class="mb-2">答對了！！</h2>
				<p class="mb-2">你問了 {questionCount} 個問題</p>
				<Button cls="w-full" on:click={reveal} variation="secondary">確定</Button>
			{:else}
				<h2 class="mb-2">答錯了！！</h2>
				<p class="mb-2">你問了 {questionCount} 個問題</p>
				<Button cls="w-full" on:click={continueGuess} variation="primary">繼續</Button>
			{/if}
		</div>
	</div>
{/if}
