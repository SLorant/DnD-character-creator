<script lang="ts">
	import { goto } from '$app/navigation';
	export let where: string;

	function goBack() {
		goto(`/${where}`);
	}
</script>

<button on:click={goBack}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="icon icon-tabler icon-tabler-arrow-big-left-line"
		width="44"
		height="44"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="#ffffff"
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path
			d="M12 15v3.586a1 1 0 0 1 -1.707 .707l-6.586 -6.586a1 1 0 0 1 0 -1.414l6.586 -6.586a1 1 0 0 1 1.707 .707v3.586h6v6h-6z"
		/>
		<path d="M21 15v-6" />
	</svg>
</button>

<style>
	button {
		position: absolute;
		top: 36px;
		left: 10px;
		background: none;
		border: none;
		cursor: pointer;
		z-index: 30;
	}
</style>
