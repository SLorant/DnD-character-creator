<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeIndexedDB, addToIndexedDB, addToIndexedDBFirst } from '../indexedDBUtil';
	import { goto } from '$app/navigation';
	import BackArrow from '../BackArrow.svelte';
	let db: any;
	let name = '';

	onMount(async () => {
		try {
			db = await initializeIndexedDB();
			console.log('IndexedDB initialized');
		} catch (error) {
			console.error('Error initializing IndexedDB', error);
		}
	});

	async function goToNext(name: string) {
		try {
			localStorage.setItem('name', name);

			const result = await addToIndexedDBFirst(db, name);
			goto('/race');
		} catch (error) {
			console.error(error);
		}
	}
</script>

<head>
	<title>Name</title>
</head>

<div class="main">
	<div class="inside">
		<h1>Character name</h1>
		<div class="namediv">
			<input type="text" bind:value={name} />
			<button on:click={() => goToNext(name)}>continue</button>
		</div>
		<div class="arrow">
			<BackArrow where={''} />
		</div>
	</div>
</div>

<style>
	button {
		cursor: pointer;
		width: 140px;
		height: 40px;
		font-size: 25px;
		border-radius: none;
		border: none;
		background: rgba(255, 255, 255, 0.7);
	}
	.namediv {
		display: flex;
		justify-content: center;
		place-items: center;
		flex-direction: column;
		gap: 40px;
		margin-bottom: 50px;
	}
	.arrow {
		position: absolute;
		top: -20px;
		left: 0px;
	}
	input {
		font-size: 20px;
		background-color: transparent;
		border: 1px solid white;
		color: white;
		font-family: 'Nova Slim', sans-serif;
		padding: 4px;
	}
	input:focus {
		outline: none;
	}
	.inside {
		height: 40%;
		width: 90%;
		border: 1px solid white;
		border-radius: 5px;
		display: flex;
		justify-content: space-around;
		place-items: center;
		flex-direction: column;
		position: relative;
	}
	@media (min-width: 600px) {
		.inside {
			width: 600px;
		}
	}
</style>
