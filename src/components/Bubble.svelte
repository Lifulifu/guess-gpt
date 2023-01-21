<script lang="ts">
	export let side: 'l' | 'r' = 'l';
	export let error: boolean = false;
	export let hiddenText: string = '';
	export let cls = '';
	$: variationStyle = side === 'r' ? 'bg-indigo-600 text-white self-end ' : 'bg-white self-start ';
	$: if (error) variationStyle += 'text-red-500 border-red-500 ';
</script>

<div class={'rounded-lg max-w-md px-4 py-2 ' + variationStyle + cls}>
	<slot />
	{#if hiddenText}
		<span class="ml-2 text-gray-500">({hiddenText})</span>
	{/if}
</div>
