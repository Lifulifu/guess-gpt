<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import Panel from './Panel.svelte';
	export let show: boolean = false;
	let guess: string = '';
	const dispatch = createEventDispatcher();

	function submitGuess(val: string) {
		dispatch('submitGuess', { guess: val });
		guess = '';
	}
</script>

<Panel bind:show>
	<h2>我猜答案是：</h2>
	<form class="mt-2" on:submit={() => submitGuess(guess)}>
		<input
			type="text"
			autofocus
			class="w-full rounded-lg border-2 border-slate-400 focus:border-indigo-600 outline-none px-4 py-2"
			bind:value={guess}
		/>
		<div class="mt-2 flex gap-2">
			<Button cls="flex-grow" on:click={() => (show = false)} variation="secondary">取消</Button>
			<input
				type="submit"
				value="確定"
				class="flex-grow rounded-lg border-2 border-indigo-600 px-4 py-2 text-lg text-white font-bold bg-indigo-600 hover:brightness-90"
			/>
		</div>
	</form>
</Panel>
