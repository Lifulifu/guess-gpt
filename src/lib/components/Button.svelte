<script lang="ts">
	export let variation: 'primary' | 'secondary' | 'warning' = 'primary';
	export let disabled: boolean = false;
	export let type: 'button' | 'submit' = 'button';
	export let autofocus: boolean = false;

	let variationStyle = '';
	$: {
		if (variation === 'primary') variationStyle = 'bg-indigo-600 text-white disabled:bg-slate-400 ';
		else if (variation === 'secondary')
			variationStyle =
				'bg-white text-indigo-600 border-2 border-indigo-600 disabled:border-slate-400 disabled:text-slate-400 ';
		else variationStyle = 'bg-red-600 text-white disabled:bg-slate-400 ';
	}
</script>

<button
	{type}
	{disabled}
	{autofocus}
	class="rounded-lg px-2 sm:px-4 py-2 text-md font-bold hover:brightness-90 {variationStyle} {$$props.class}"
	on:click
>
	<slot />
</button>
