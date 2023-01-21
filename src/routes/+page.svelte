<script lang="ts">
	import { onMount } from 'svelte';

	import type { BubbleData, LogData } from '../types';
	import { TARGET, PROBLEMS } from '../constants';
	import Button from '../components/Button.svelte';
	import Conversation from '../components/Conversation.svelte';
	import GuessPanel from '../components/GuessPanel.svelte';

	// data
	let problem: string = '';
	let textInputValue: string = TARGET;
	let conversation: BubbleData[] = [];
	let logs: LogData[] = [];

	// UI
	let textInputDom: HTMLInputElement;
	let textInputDisabled: boolean = false;
	let isTyping: 'l' | 'r' | null;
	let showGuessPanel: boolean = false;
	let showHiddenText: boolean = false;

	onMount(() => {
		reset();
	});

	function reset() {
		textInputValue = TARGET;
		conversation = [];
		isTyping = null;
		logs = [];
		problem = getProblem();
	}

	function getProblem() {
		return PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
	}

	function addTheThing() {
		const startPos = textInputDom.selectionStart;
		const endPos = textInputDom.selectionEnd;
		if (startPos === null || endPos === null) {
			textInputValue += TARGET;
		} else {
			textInputValue =
				textInputValue.substring(0, startPos) +
				TARGET +
				textInputValue.substring(endPos, textInputValue.length);
		}
		textInputDom.focus();
	}

	function updateConversation(
		side: 'l' | 'r',
		text: string,
		hiddenText: string = '',
		error: boolean = false
	) {
		conversation.push({ side, text, hiddenText, error });
		conversation = conversation;
	}

	function updateLogs(question: string, answer: string, reason: string) {
		logs.push({ question, answer, reason });
		logs = logs;
	}

	function fetchAnswer(q: string, target: string) {
		return fetch(`/api/guess-object?q=${q}&target=${target}`);
	}

	async function askQuestion(question: string) {
		if (question === '') return;
		// add my question to the conversation
		updateConversation('r', question);
		// wait for response
		textInputDisabled = true;
		isTyping = 'l';
		try {
			const res = await fetchAnswer(question, problem);
			if (!res.ok) throw new Error('error fetching response.');
			const response = (await res.json()) as { res: string; answer: string; reason: string };

			// got response, add it to the conversation and logs
			updateConversation('l', response.answer, response.reason);
			updateLogs(question, response.answer, response.reason);
			textInputValue = TARGET; // reset input value
		} catch (e) {
			updateConversation('l', '發生錯誤，請再試一次', '', true);
			console.error(e);
		}
		textInputDisabled = false;
		isTyping = null;
		textInputDom.focus();
	}

	function onGuessClick() {
		showGuessPanel = true;
	}

	function guess(val: string) {
		console.log('guess');
		if (!val) return;
		showGuessPanel = false;
		val = val.trim();
		updateConversation('r', `我猜答案是"${val}"`);
		if (val === problem) {
			updateConversation('l', '恭喜你答對了！');
			showHiddenText = true;
		} else {
			updateConversation('l', '答案不對喔，再試試看！');
		}
	}
</script>

<div class="bg-slate-200">
	<div class="m-auto max-w-2xl h-screen px-4 py-8 flex flex-col gap-2">
		<Conversation data={conversation} {isTyping} {showHiddenText} cls="flex-grow" />

		<div class="flex gap-2">
			<Button variation="secondary" on:click={addTheThing}>加入"{TARGET}"</Button>
			<Button variation="primary" on:click={onGuessClick}>我要作答</Button>
		</div>

		<form class="flex-shrink-0 flex" on:submit={() => askQuestion(textInputValue)}>
			<input
				type="text"
				bind:this={textInputDom}
				bind:value={textInputValue}
				disabled={textInputDisabled}
				class="flex-grow rounded-l-lg border-2 border-slate-400 focus:border-indigo-600 outline-none px-4 py-2"
			/>
			<input
				type="submit"
				value="我要提問"
				class="rounded-r-lg border-2 border-indigo-600 px-4 py-2 text-lg text-white font-bold bg-indigo-600 hover:brightness-90"
			/>
		</form>
	</div>

	<GuessPanel bind:show={showGuessPanel} on:submitGuess={(e) => guess(e.detail.guess)} />
</div>
