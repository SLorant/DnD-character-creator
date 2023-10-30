<script>
	import CharacterDetails from './CharacterDetails.svelte';
	let visible = false;
	function showChar() {
		visible = !visible;
		console.log(localStorage.getItem('race'));
	}
</script>

<footer>
	<button on:click={showChar}>asd</button>
	{#if visible}
		<CharacterDetails bind:visible />
	{/if}
</footer>

<style>
	footer {
		width: 100%;
		height: 60px;
		background-color: black;
		border-radius: 20px 20px 0px 0px;
		z-index: 100;
	}
</style>
