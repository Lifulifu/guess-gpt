<script lang="ts">
	import { onMount } from 'svelte';
	import './app.css'

	import type { BubbleData, LogData } from './lib/types';
	import { TARGET_PLACEHOLDER, PROBLEMS, RESPONSE_MAPPING } from './lib/constants';
	import Button from './lib/components/Button.svelte';
	import Conversation from './lib/components/Conversation.svelte';
	import GuessPanel from './lib/components/GuessPanel.svelte';
	import ResultPanel from './lib/components/ResultPanel.svelte';
	import ProvideApiKeyPanel from './lib/components/ProvideApiKeyPanel.svelte';

	import pinyin from 'chinese-to-pinyin';
	import {GuessGptCore} from './lib/core'

	// data
	let targetValue: string = '';
	let questionInputValue: string = TARGET_PLACEHOLDER;
	let conversation: BubbleData[] = [];
	let hint: string = '';
	let questionCount: number = 0;
	let isWin: boolean = false;
	let gameEnded: boolean = false;
	let apikey: string = "";
	$: core = apikey?.length <= 0 ? null : new GuessGptCore(apikey);

	// UI
	let textInputDom: HTMLInputElement;
	let isTyping: 'l' | 'r' | null;
	let showGuessPanel: boolean = false;
	let showResultPanel: boolean = false;
	let showHiddenText: boolean = false;
	let inputLocked: boolean = false;
	let windowHeight: number = 0;
	let showProvideApiPanel: boolean = true;

	onMount(() => {
		resetGame();
	});

	function resetGame() {
		gameEnded = false;
		questionInputValue = TARGET_PLACEHOLDER;
		conversation = [];
		questionCount = 0;
		isWin = false;
		isTyping = null;
		showHiddenText = false;
		inputLocked = false;

		// generate new problem
		targetValue = getProblem();
		hint = `這個東西有 ${targetValue.length} 個字，聲調是 ${getTone(targetValue)} 聲，請問是什麼？`;
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
			questionInputValue += TARGET_PLACEHOLDER;
		} else {
			questionInputValue =
				questionInputValue.substring(0, startPos) +
				TARGET_PLACEHOLDER +
				questionInputValue.substring(endPos, questionInputValue.length);
		}
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

	async function submitQuestion() {
		if (questionInputValue === '') return;
		// add my question to the conversation
		updateConversation('r', questionInputValue);
		// wait for response
		inputLocked = true;
		isTyping = 'l';
		try {
			let response = await core.ask(questionInputValue, targetValue);
			let answerText = RESPONSE_MAPPING[response.answer];
			updateConversation('l', answerText, response.reason);
			questionCount++;
			questionInputValue = TARGET_PLACEHOLDER; // reset input value
		} catch (e) {
			updateConversation('l', '發生錯誤，請再試一次', '', true);
			console.error(e);
		}
		inputLocked = false;
		isTyping = null;
	}

	function textInputIsValid(text: string) {
		return text !== '' && text.includes(TARGET_PLACEHOLDER);
	}

	function onGuessClick() {
		if (isWin) showResultPanel = true;
		else showGuessPanel = true;
	}

	function submitGuess(val: string) {
		if (!val) return;
		showGuessPanel = false;
		val = val.trim();
		updateConversation('r', `我猜答案是"${val}"`);
		if (val === targetValue) {
			isWin = true;
			showResultPanel = true;
			updateConversation('l', `答對了!`);
			reveal();
		} else {
			isWin = false;
			showResultPanel = true;
			updateConversation('l', `答錯了！`);
			questionInputValue = TARGET_PLACEHOLDER;
		}
	}

	function reveal() {
		updateConversation('l', `答案是"${targetValue}"!`);
		showHiddenText = true;
		inputLocked = true;
		gameEnded = true;
	}

	function continueGuess() {
		questionCount++;
	}
</script>

<div class='fixed w-full px-4 flex items-center gap-4 bg-white h-12 shadow'>
	<div class="mr-auto text-2xl text-indigo-600 font-bold whitespace-pre">🤔 GuessGPT</div>
	<div class="text-slate-600 font-bold cursor-pointer" on:click={() => {showProvideApiPanel = true}}>API Key</div>
	<a href="https://github.com/Lifulifu/guess-gpt" class="text-slate-600 font-bold">玩法說明</a>
</div>

<div class="main-content px-4 bg-slate-200" style={`--window-height: ${windowHeight}px`}>
	<div class="mx-auto h-full w-full max-w-2xl pt-16 pb-4 flex flex-col gap-2 ">
		<Conversation data={conversation} {isTyping} {showHiddenText} class="flex-grow" />

		<div class="flex gap-2 pt-2 border-t border-slate-400">
			<Button variation="secondary" disabled={inputLocked} class="mr-auto" on:click={addTheThing}>
				這個東西"{TARGET_PLACEHOLDER}"
			</Button>
			<Button variation="warning" disabled={gameEnded} on:click={reveal}>放棄</Button>
			<Button variation="secondary" on:click={resetGame}>重開</Button>
			<Button variation="primary" disabled={gameEnded} on:click={onGuessClick}>作答</Button>
		</div>

		<form class="flex" on:submit|preventDefault={submitQuestion}>
			<input
				type="text"
				autofocus
				bind:this={textInputDom}
				bind:value={questionInputValue}
				disabled={inputLocked || gameEnded}
				class="min-w-0 flex-grow rounded-l-lg border-2 border-slate-400 focus:border-indigo-600 outline-none px-4 py-2"
			/>
			<Button
				type="submit"
				disabled={!textInputIsValid(questionInputValue) || inputLocked || gameEnded}
				class="rounded-l-none"
			>我要提問</Button>
		</form>
		<div
			class={`text-sm text-red-500 ${textInputIsValid(questionInputValue) ? 'invisible' : 'visible'}`}
		>
			問題必須包含"{TARGET_PLACEHOLDER}"!
		</div>

		<GuessPanel
			bind:show={showGuessPanel}
			on:submitGuess={(e) => submitGuess(e.detail.guess)}
		/>

		<ResultPanel
			bind:show={showResultPanel}
			win={isWin}
			{questionCount}
			on:continue={continueGuess}
		/>

		<ProvideApiKeyPanel
			bind:show={showProvideApiPanel}
			on:submit={(val) => {
				apikey = val.detail.value;
				showProvideApiPanel = false;
			}}
		/>
	</div>
</div>


<svelte:window bind:innerHeight={windowHeight} />

<style>
	.main-content {
		height: var(--window-height);
	}
</style>
