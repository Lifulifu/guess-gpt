<script lang="ts">
	export let variation: 'primary' | 'secondary' | 'warning' = 'primary';
	export let cls = '';

	let variationStyle = '';
	$: {
		if (variation === 'primary') variationStyle = 'bg-indigo-600 text-white ';
		else if (variation === 'secondary')
			variationStyle = 'bg-white text-indigo-600 border-2 border-indigo-600 ';
		else variationStyle = 'bg-red-600 text-white ';
	}
</script>

<button
	type="button"
	class={'rounded-lg px-4 py-2 text-lg font-bold hover:brightness-90 ' + variationStyle + cls}
	on:click
>
	<slot />
</button>
