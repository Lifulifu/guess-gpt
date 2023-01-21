<script lang="ts">
	import Bubble from './Bubble.svelte';
	import type { BubbleData } from '../types';
	export let data: BubbleData[] = [];
	export let showHiddenText: boolean = false;
	export let isTyping: 'l' | 'r' | null;
	export let cls = '';
</script>

<div class={'flex flex-col gap-2 overflow-y-auto ' + cls}>
	{#each data as bubble}
		<Bubble
			side={bubble.side}
			error={bubble.error}
			hiddenText={showHiddenText ? bubble?.hiddenText : ''}
		>
			{bubble.text}
		</Bubble>
	{/each}
	{#if isTyping === 'l'}
		<Bubble side="l">
			<span class="animate-pulse text-gray-400">...</span>
		</Bubble>
	{:else if isTyping === 'r'}
		<Bubble side="r">
			<span class="animate-pulse text-gray-400">...</span>
		</Bubble>
	{/if}
</div>
