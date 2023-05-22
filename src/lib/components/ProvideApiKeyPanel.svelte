<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import Panel from "./Panel.svelte";
  import Button from './Button.svelte';
  export let show = true;
	const dispatch = createEventDispatcher();
  let apikey: string = "";

  function submitApikey() {
    dispatch('submit', {value: apikey})
  }
</script>

<Panel bind:show closable={false}>
	<h2>請提供您的 OpenAI API key</h2>
	<form class="mt-2" on:submit|preventDefault={submitApikey}>
		<input
			type="text"
			autofocus
			class="w-full rounded-lg border-2 border-slate-400 focus:border-indigo-600 outline-none px-4 py-2"
			bind:value={apikey}
		/>
		<Button type="submit" class="w-full mt-2">確定</Button>
	</form>
</Panel>