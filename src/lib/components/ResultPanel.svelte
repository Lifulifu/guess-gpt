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
		show = false;
	}
</script>

<Panel bind:show>
	{#if win}
		<form on:submit={() => (show = false)}>
			<h2>答對了！！</h2>
			<p class="mt-2">你問了 {questionCount} 個問題</p>
			<Button autofocus type="submit" cls="mt-2 w-full" variation="primary">確定</Button>
		</form>
	{:else}
		<form on:submit={continueGuess}>
			<h2>答錯了！！</h2>
			<p class="mt-2">你問了 {questionCount} 個問題</p>
			<Button autofocus type="submit" cls="mt-2 w-full" variation="primary">繼續</Button>
		</form>
	{/if}
</Panel>
