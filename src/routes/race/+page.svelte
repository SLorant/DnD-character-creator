<script lang="ts">
	import { fly } from 'svelte/transition';
	import { openDB } from './indexedDB';
	import RaceDetails from './RaceDetails.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	interface races {
		[name: string]: string;
	}
	let races: races = {};
	let loading = true;
	let visible = false;
	let currentRace = ['human', 'human.jpg'];
	function handleVisible(race: string) {
		visible = !visible;
		const searchRace = Object.keys(races).find((key) => key === race) ?? 'human';
		const searchRaceImage = Object.values(races).find((key) => key === race + '.jpg') ?? 'human.jpg';
		currentRace = [searchRace, searchRaceImage];
	}
	let db: IDBDatabase;

	onMount(() => {
		fetchData();
	});

	async function fetchData() {
		try {
			const response = await fetch(`https://www.dnd5eapi.co/api/races`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
				}
			});
			if (response.ok) {
				const responseData = await response.json();
				console.log(responseData);
				responseData.results.forEach((race: any) => {
					races[race.index] = race.index + '.jpg';
				});
				loading = false;
				// Continue fetching trait descriptions here, if needed
			} else {
				console.error('Failed to fetch race data');
			}
		} catch (error) {
			console.error('Error while fetching race data: ' + error);
		}
	}

	// Fetch data when the component is created
</script>

<div class="main" class:main2={visible}>
	<div class="progressbar" />
	<h1>Choose your race</h1>
	{#if !loading && !visible}
		<div class="races">
			{#each Object.entries(races) as [race, image]}
				<div class="onerace">
					<button on:click={() => handleVisible(race)} class="choose">{race}</button>
					<img src="/bard.jpg" alt="" />
				</div>
			{/each}
		</div>
	{:else}
		<div class="loading">Loading...</div>
	{/if}

	{#if visible}
		<RaceDetails bind:visible {currentRace} />
		<button class="choose">{currentRace[0]}</button>
	{/if}
</div>

<style>
	.main {
		justify-content: start;
		place-items: start;
		height: 100%;
	}
	.main2 {
		height: 100vh;
	}
	.loading {
		height: 100vh;
	}
	.races {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		place-items: center;
		row-gap: 30px;
		margin-bottom: 30px;
	}
	.onerace {
		width: calc(100% - 60px);
		height: 150px;
		position: relative;
		display: flex;
		justify-content: center;
		place-items: center;
	}
	.choose {
		color: #cdf8fb;
		background: none;
		border: none;
		text-decoration: none;
		display: flex;
		justify-content: center;
		place-items: center;
		z-index: 20;
		font-weight: bold;
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: #cdf8fb;
		font-size: 30px;
		cursor: pointer;
		width: 100%;
		height: 100%;
	}
	img {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0px;
		border-radius: 20px;
		object-fit: cover;
		opacity: 0.4;
	}

	a {
		width: 80%;
		height: 100%;
		font-size: 40px;
	}
</style>
