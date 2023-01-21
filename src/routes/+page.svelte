<script lang="ts">
	import { onMount } from 'svelte';

	const theThing = '🤔';
	let textInputDom: HTMLInputElement;
	let textInputValue: string = theThing;
	let response: string = '';

	onMount(() => {
		fetch('/api')
			.then(() => {
				console.log('api setup done.');
			})
			.catch((e) => {
				console.error(e);
			});
	});

	function addTheThing() {
		const startPos = textInputDom.selectionStart;
		const endPos = textInputDom.selectionEnd;
		if (startPos === null || endPos === null) {
			textInputValue += theThing;
		} else {
			textInputValue =
				textInputValue.substring(0, startPos) +
				theThing +
				textInputValue.substring(endPos, textInputValue.length);
		}
		textInputDom.focus();
	}

	function askQuestion() {
		fetch(`/api?q=${textInputValue}`).then(async (res) => {
			if (!res.ok) {
				console.error(res);
				return;
			}
			console.log(await res.json());
		});
		textInputDom.value = '';
	}
</script>

<!-- chatroom  -->
<div class="bg-slate-50">
	<div class="m-auto max-w-2xl h-screen px-4 py-8 flex flex-col gap-2">
		<div class="flex-grow">
			{response}
		</div>

		<div class="flex gap-2">
			<button
				class="rounded-full px-4 py-2 text-lg text-indigo-600 font-bold bg-white border-2 border-indigo-600 hover:brightness-90"
				on:click={addTheThing}
			>
				加入"{theThing}"
			</button>
			<button
				class="rounded-full px-4 py-2 text-lg text-white font-bold bg-indigo-600 hover:brightness-90"
			>
				我要作答
			</button>
		</div>

		<form class="flex-shrink-0 flex" on:submit={askQuestion}>
			<input
				type="text"
				bind:this={textInputDom}
				bind:value={textInputValue}
				class="flex-grow rounded-l-full border-2 focus:border-indigo-600 outline-none px-4 py-2"
			/>
			<input
				type="submit"
				value="我要提問"
				class="rounded-r-full border-2 border-indigo-600 px-4 py-2 text-lg text-white font-bold bg-indigo-600 hover:brightness-90"
			/>
		</form>
	</div>
</div>
