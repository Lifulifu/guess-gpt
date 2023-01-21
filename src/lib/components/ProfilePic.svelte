<script lang="ts">
	export let src: string = '';
	export let cls: string = '';
</script>

<img {src} alt="profile-pic" class={'rounded-full ' + cls} />
