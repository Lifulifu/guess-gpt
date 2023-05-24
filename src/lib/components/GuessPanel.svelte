<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import Panel from './Panel.svelte';
	export let show: boolean = false;
	let guess: string = '';
	const dispatch = createEventDispatcher();

	function submitGuess() {
		dispatch('submitGuess', { guess });
		guess = '';
	}
</script>

<Panel bind:show>
	<h2>我猜答案是：</h2>
	<form class="mt-2" on:submit|preventDefault={submitGuess}>
		<input
			type="text"
			autofocus
			class="w-full rounded-lg border-2 border-slate-400 focus:border-indigo-600 outline-none px-4 py-2"
			bind:value={guess}
		/>
		<div class="mt-2 flex gap-2">
			<Button class="flex-grow" on:click={() => (show = false)} variation="secondary">取消</Button>
			<Button class="flex-grow" type="submit">確定</Button>
		</div>
	</form>
</Panel>
