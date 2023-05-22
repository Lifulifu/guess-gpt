<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import Panel from './Panel.svelte';
	export let show: boolean = false;
	export let win: boolean = false;
	export let questionCount: number = 0;

	const dispatch = createEventDispatcher();

	function continueGuess() {
		dispatch('continue');
		closePanel();
	}

	function closePanel() {
		show = false;
	}
</script>

<Panel bind:show>
	{#if win}
		<form on:submit|preventDefault={closePanel}>
			<h2>答對了！！</h2>
			<p class="mt-2">你問了 {questionCount} 個問題</p>
			<Button type="submit" class="mt-2 w-full" variation="primary">確定</Button>
		</form>
	{:else}
		<form on:submit|preventDefault={continueGuess}>
			<h2>答錯了！！</h2>
			<p class="mt-2">你問了 {questionCount} 個問題</p>
			<Button type="submit" class="mt-2 w-full" variation="primary">繼續</Button>
		</form>
	{/if}
</Panel>
