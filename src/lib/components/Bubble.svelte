<script lang="ts">
	import ProfilePic from './ProfilePic.svelte';
	import openaiProfilePic from '../assets/openai.jpeg';

	export let side: 'l' | 'r' = 'l';
	export let error: boolean = false;
	export let hiddenText: string = '';
	export let cls = '';
	$: variationStyle = side === 'r' ? 'bg-indigo-600 text-white ' : 'bg-white ';
	$: positionStyle = side === 'r' ? 'self-end ' : 'self-start ';
	$: if (error) variationStyle += 'text-red-500 border-red-500 ';
</script>

<div class={'flex gap-2 items-end ' + positionStyle + cls}>
	{#if side === 'l'}
		<ProfilePic src={openaiProfilePic} cls="w-12 h-12" />
	{/if}
	<div class={'rounded-lg max-w-md px-4 py-2 ' + variationStyle}>
		{#if error}
			<span class="text-lg font-bold">⛔️</span>
		{/if}
		<slot />
		{#if hiddenText}
			<span class="ml-2 text-gray-500">({hiddenText})</span>
		{/if}
	</div>
</div>
