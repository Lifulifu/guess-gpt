<script lang="ts">
	import { onMount } from 'svelte';

	import type { BubbleData, LogData } from '$lib/types';
	import { TARGET, PROBLEMS } from '$lib/constants';
	import Button from '$lib/components/Button.svelte';
	import Conversation from '$lib/components/Conversation.svelte';
	import GuessPanel from '$lib/components/GuessPanel.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ResultPanel from '$lib/components/ResultPanel.svelte';
	import pinyin from 'chinese-to-pinyin';

	// data
	let problem: string = '';
	let textInputValue: string = TARGET;
	let conversation: BubbleData[] = [];
	let logs: LogData[] = [];
	let hint: string = '';
	let questionCount: number = 0;
	let isWin: boolean = false;

	// UI
	let textInputDom: HTMLInputElement;
	let isTyping: 'l' | 'r' | null;
	let showGuessPanel: boolean = false;
	let showResultPanel: boolean = false;
	let showHiddenText: boolean = false;
	let inputLocked: boolean = false;

	onMount(() => {
		reset();
	});

	function reset() {
		textInputValue = TARGET;
		conversation = [];
		logs = [];
		questionCount = 0;
		isWin = false;
		isTyping = null;
		showHiddenText = false;
		inputLocked = false;

		// generate new problem
		problem = getProblem();
		hint = `這個東西有 ${problem.length} 個字，聲調是 ${getTone(problem)} 聲，請問是什麼？`;
		updateConversation('l', hint);
	}

	function getProblem() {
		return PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
	}

	function getTone(text: string) {
		return (pinyin(text, { toneToNumberOnly: true }) as string).replaceAll(' ', ',');
	}

	function addTheThing() {
		if (inputLocked) return;
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
		inputLocked = true;
		isTyping = 'l';
		try {
			const res = await fetchAnswer(question, problem);
			if (!res.ok) throw new Error('error fetching response.');
			const response = (await res.json()) as { res: string; answer: string; reason: string };

			// got response, add it to the conversation and logs
			updateConversation('l', response.answer, response.reason);
			updateLogs(question, response.answer, response.reason);
			questionCount++;
			textInputValue = TARGET; // reset input value
		} catch (e) {
			updateConversation('l', '發生錯誤，請再試一次', '', true);
			console.error(e);
		}
		inputLocked = false;
		isTyping = null;
		textInputDom.focus();
	}

	function textInputIsValid(text: string) {
		return text !== '' && text.includes(TARGET);
	}

	function onGuessClick() {
		if (isWin) showResultPanel = true;
		else showGuessPanel = true;
	}

	function guess(val: string) {
		if (!val) return;
		showGuessPanel = false;
		val = val.trim();
		updateConversation('r', `我猜答案是"${val}"`);
		if (val === problem) {
			isWin = true;
			showResultPanel = true;
			updateConversation('l', `答對了，答案是"${problem}"!`);
		} else {
			isWin = false;
			showResultPanel = true;
			updateConversation('l', `答錯了！`);
		}
	}

	function reveal() {
		updateConversation('l', `答案是"${problem}"!`);
		showHiddenText = true;
		inputLocked = true;
	}

	function continueGuess() {
		questionCount++;
	}
</script>

<Navbar cls="h-12" />
<div class="h-screen px-4 bg-slate-200">
	<div class="mx-auto h-full w-full max-w-2xl pt-16 pb-10 flex flex-col gap-2 ">
		<Conversation data={conversation} {isTyping} {showHiddenText} cls="flex-grow" />

		<div class="flex gap-2 pt-2 border-t border-slate-400">
			<Button variation="secondary" cls="mr-auto" on:click={addTheThing}>這個東西"{TARGET}"</Button>
			<Button variation="warning" on:click={reveal}>放棄</Button>
			<Button variation="secondary" on:click={reset}>重開</Button>
			<Button variation="primary" on:click={onGuessClick}>作答</Button>
		</div>

		<form class="flex" on:submit={() => askQuestion(textInputValue)}>
			<input
				type="text"
				bind:this={textInputDom}
				bind:value={textInputValue}
				disabled={inputLocked}
				class="flex-grow rounded-l-lg border-2 border-slate-400 focus:border-indigo-600 outline-none px-4 py-2"
			/>
			<input
				type="submit"
				value="我要提問"
				disabled={!textInputIsValid(textInputValue) || inputLocked}
				class="rounded-r-lg border-2 border-indigo-600 px-4 py-2 text-lg text-white font-bold bg-indigo-600 hover:brightness-90 disabled:bg-slate-400 disabled:border-slate-400"
			/>
		</form>

		<GuessPanel bind:show={showGuessPanel} on:submitGuess={(e) => guess(e.detail.guess)} />

		<ResultPanel
			bind:show={showResultPanel}
			win={isWin}
			{questionCount}
			on:reveal={reveal}
			on:continue={continueGuess}
		/>
	</div>
</div>
