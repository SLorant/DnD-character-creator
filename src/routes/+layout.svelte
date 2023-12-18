<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	onMount(() => {
		if ('serviceWorker' in globalThis.navigator) {
			globalThis.addEventListener('load', function () {
				globalThis.navigator.serviceWorker.register('./service-worker.js', {
					type: dev ? 'module' : 'classic'
				});
			});
		}
	});
</script>

<slot />

<style>
	:global(.main) {
		font-family: 'Nova Slim', sans-serif;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		place-items: center;
	}
	:global(a) {
		color: #cdf8fb;
		text-decoration: none;
		display: flex;
		justify-content: center;
		place-items: center;
		z-index: 20;
		font-weight: bold;
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: #cdf8fb;
	}
	:global(button) {
		font-family: 'Nova Slim', sans-serif;
	}
	:global(h1) {
		color: #cdf8fb;
		text-decoration: none;
		width: 100%;
		margin: 40px 0px;
		display: flex;
		justify-content: center;
		place-items: center;
		z-index: 20;
	}
</style>
