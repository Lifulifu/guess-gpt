<script lang="ts">
	export let variation: 'primary' | 'secondary' = 'primary';
	$: variationStyle =
		variation === 'primary'
			? 'bg-indigo-600 text-white '
			: 'bg-white text-indigo-600 border-2 border-indigo-600 ';
	export let cls = '';
</script>

<button
	type="button"
	class={'rounded-lg px-4 py-2 text-lg font-bold hover:brightness-90 ' + variationStyle + cls}
	on:click
>
	<slot />
</button>
