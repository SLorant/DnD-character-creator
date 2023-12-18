<script lang="ts">
	import { fly } from 'svelte/transition';
	import Features from './Features.svelte';
	import { onMount } from 'svelte';
	export let visible: boolean;
	export let currentClass: string[];
	import { initializeIndexedDB, addToIndexedDB } from '../indexedDBUtil';
	import { goto } from '$app/navigation';

	let db: any;

	onMount(async () => {
		try {
			db = await initializeIndexedDB();
			console.log('IndexedDB initialized');
		} catch (error) {
			console.error('Error initializing IndexedDB', error);
		}
	});

	async function goToNext(charclass: string) {
		console.log(db);
		try {
			const result = await addToIndexedDB(db, charclass, 'class');
			console.log(result);
			goto('/attributes');
		} catch (error) {
			console.error(error);
		}
	}
	console.log(currentClass);
</script>

<div class="visible" transition:fly={{ y: 200, duration: 200 }}>
	<img class="descimg" src="/arts/{currentClass[1]}" alt="" />
	<div class="header"><h1>{currentClass[0]}</h1></div>
	<button
		class="exit"
		on:click={() => {
			visible = false;
		}}>X</button
	>
	<div class="traitheader">
		<div class="features">Features</div>
	</div>
	<div class="detailintro">
		<Features charclass={currentClass[0]} />
	</div>
	<div class="chooser">
		<button
			on:click={() => {
				visible = false;
			}}>Cancel</button
		>
		<button class="chooserace" on:click={() => goToNext(currentClass[0])}>Choose class</button>
	</div>
</div>

<style>
	.visible {
		position: absolute;
		top: 0px;
		right: 0px;
		display: flex;
		flex-direction: column;
		width: 100%;
		background: var(--gradient, linear-gradient(180deg, #2c3146 0%, #595b67 50.17%, #191726 100%));
		z-index: 40;
	}

	h1 {
		color: white;
		font-size: 32px;
	}
	button {
		cursor: pointer;
		width: 50%;
		font-size: 25px;
		border-radius: none;
		border: none;
		background: rgba(255, 255, 255, 0.7);
	}

	.chooserace {
		border-left: 2px solid black;
		background-color: #7aca8b;
	}
	.chooser {
		display: flex;
		width: 100%;
		height: 50px;
	}
	.descimg {
		width: 100%;
		height: 210px;
		opacity: 1;
		object-fit: cover;
		position: absolute;
		top: 0;
		right: 0;
	}
	.header {
		margin-top: 170px;
		display: flex;
		flex-direction: column;
		z-index: 100;
		justify-content: start;
		width: 100%;
		height: 90px;
		background: linear-gradient(0deg, #141414 55.26%, rgba(20, 20, 20, 0.45) 78.54%, rgba(20, 20, 20, 0) 97.42%);
		box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.25);
	}
	.exit {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 50px;
		border-radius: 20px;
		height: 50px;
		background-color: #6a6a83;
		font-size: 30px;
		z-index: 50;
		border: none;
	}

	.traitheader {
		display: flex;
		width: 100%;
		justify-content: center;
		place-items: center;
	}
	.detailintro {
		color: #14182d;
		min-height: 62vh;
	}
	.features {
		border: none;
		width: 100%;
		height: 40px;
		background-color: rgba(20, 20, 20, 0.6);
		color: white;
		font-size: 20px;
		font-family: 'Nova Slim', sans-serif;
		box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.25);
		border-radius: 0px 0px 10px 10px;
		display: flex;
		justify-content: center;
		place-items: center;
	}
	@media (min-width: 900px) {
		.visible {
			width: 900px;
			top: 0px;
			right: 0px;
			position: relative;
		}
	}
</style>
