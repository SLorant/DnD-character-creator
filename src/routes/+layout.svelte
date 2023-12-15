<script lang="ts">
	import Footer from './footer.svelte';
	import { pwaInfo } from 'virtual:pwa-info';
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

	// global.navigator.serviceWorker.register('/service-worker.js', {
	// 	type: dev ? 'module' : 'classic'
	// });
	// onMount(async () => {
	// 	if (pwaInfo) {
	// 		const { registerSW } = await import('virtual:pwa-register');
	// 		registerSW({
	// 			immediate: true,
	// 			onRegistered(r: any) {
	// 				// uncomment following code if you want check for updates
	// 				// r && setInterval(() => {
	// 				//    console.log('Checking for sw update')
	// 				//    r.update()
	// 				// }, 20000 /* 20s for testing purposes */)
	// 				console.log(`SW Registered: ${r}`);
	// 			},
	// 			onRegisterError(error: any) {
	// 				console.log('SW registration error', error);
	// 			}
	// 		});
	// 	}
	// });

	// $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<!-- 
<svelte:head>
	{@html webManifestLink}
</svelte:head> -->

<slot />

<Footer />

<!-- {#await import('./ReloadPrompt.svelte') then { default: ReloadPrompt }}
	<ReloadPrompt />
{/await} -->

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
