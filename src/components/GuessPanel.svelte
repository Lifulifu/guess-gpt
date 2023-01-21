<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	export let show: boolean = false;
	let guess: string = '';
	const dispatch = createEventDispatcher();

	function submitGuess(val: string) {
		dispatch('submitGuess', { guess: val });
		guess = '';
	}
</script>

{#if show}
	<div on:click={() => (show = false)} on:keydown class="fixed inset-0 bg-black/50">
		<div
			on:click|stopPropagation
			on:keydown
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md text-center rounded-lg p-8 bg-slate-200"
		>
			<h2>我猜答案是：</h2>
			<form class="mt-2" on:submit={() => submitGuess(guess)}>
				<input
					type="text"
					class="w-full rounded-lg border-2 border-slate-400 focus:border-indigo-600 outline-none px-4 py-2"
					bind:value={guess}
				/>
				<div class="mt-2 flex gap-2">
					<Button on:click={() => (show = false)} variation="secondary">取消</Button>
					<input
						type="submit"
						value="確定"
						class="rounded-lg border-2 border-indigo-600 px-4 py-2 text-lg text-white font-bold bg-indigo-600 hover:brightness-90"
					/>
				</div>
			</form>
		</div>
	</div>
{/if}
