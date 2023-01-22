<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Panel from '$lib/components/Panel.svelte';
	export let show: boolean = false;
	export let win: boolean = false;
	export let questionCount: number = 0;

	const dispatch = createEventDispatcher();

	function continueGuess() {
		dispatch('continue');
		show = false;
	}
</script>

<Panel bind:show>
	{#if win}
		<h2>答對了！！</h2>
		<p class="mt-2">你問了 {questionCount} 個問題</p>
		<Button cls="mt-2 w-full" on:click={() => (show = false)} variation="primary">確定</Button>
	{:else}
		<h2>答錯了！！</h2>
		<p class="mt-2">你問了 {questionCount} 個問題</p>
		<Button cls="mt-2 w-full" on:click={continueGuess} variation="primary">繼續</Button>
	{/if}
</Panel>
