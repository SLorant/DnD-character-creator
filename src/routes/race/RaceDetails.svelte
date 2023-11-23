<script lang="ts">
	import IntroText from './IntroText.svelte';
	import { fly } from 'svelte/transition';
	import Traits from './Traits.svelte';
	import { onMount } from 'svelte';
	export let visible: boolean;
	export let currentRace: string[];
	import { initializeIndexedDB, addToIndexedDB } from '../indexedDBUtil';

	let db: any;

	onMount(async () => {
		try {
			db = await initializeIndexedDB();
			console.log('IndexedDB initialized');
		} catch (error) {
			console.error('Error initializing IndexedDB', error);
		}
	});

	async function goToNext(username: string, race: string) {
		console.log(db);
		try {
			const result = await addToIndexedDB(db, race);
			console.log(result);
			// Redirect or perform other actions here
		} catch (error) {
			console.error(error);
		}
	}
	// let db: IDBDatabase;
	// var myHeaders = new Headers();
	// myHeaders.append('Accept', 'application/json');
	// onMount(() => {
	// 	const dbName = 'DnDCharacterDB';
	// 	const dbVersion = 1;

	// 	const request: IDBOpenDBRequest = indexedDB.open(dbName, dbVersion);
	// 	request.onsuccess = (event: any) => {
	// 		db = event.target.result;
	// 	};
	// 	request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
	// 		db = (event.target as IDBOpenDBRequest).result;

	// 		if (!db.objectStoreNames.contains('characters')) {
	// 			db.createObjectStore('characters', { keyPath: 'username' });
	// 		}
	// 	};
	// 	return db
	// });

	// function goToNext(username: string, race: string) {
	// 	if (db) {
	// 		const transaction = db.transaction(['characters'], 'readwrite');

	// 		const store = transaction.objectStore('characters');

	// 		const character = {
	// 			username: username, // Use the user's username as the key
	// 			race: race
	// 			// Add other character properties as needed
	// 		};

	// 		const request = store.add(character);

	// 		request.onsuccess = function () {
	// 			console.log('Character data added to IndexedDB');
	// 			//goto('/race/subrace');
	// 		};

	// 		request.onerror = function (e) {
	// 			console.error('Error adding character data to IndexedDB', e);
	// 		};
	// 	}
	// }
</script>

<div class="visible" transition:fly={{ y: 200, duration: 200 }}>
	<img class="descimg" src={currentRace[1]} alt="" />
	<div class="header"><h1>{currentRace[0]}</h1></div>
	<button
		class="exit"
		on:click={() => {
			visible = false;
		}}>X</button
	>
	<div class="traitheader">
		<div class="traits">Traits</div>
	</div>
	<div class="detailintro">
		<Traits race={currentRace[0]} />
	</div>
	<div class="chooser">
		<button>Cancel</button>
		<button class="chooserace" on:click={() => goToNext('asd1', currentRace[0])}>Choose race</button>
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
	a {
		color: black;
		font-weight: normal;
		-webkit-text-stroke-width: 0px;
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
	}
	.traits {
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
</style>
