<script lang="ts">
	import RaceDetails from './RaceDetails.svelte';
	import { onMount } from 'svelte';
	import BackArrow from '../BackArrow.svelte';
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
			} else {
				console.error('Failed to fetch race data');
			}
		} catch (error) {
			console.error('Error while fetching race data: ' + error);
		}
	}
</script>

<head>
	<title>Race</title>
</head>
<div class="main" class:main2={visible}>
	<h1>Choose your race</h1>
	{#if !loading && !visible}
		<div class="races">
			<BackArrow where={'name'} />
			{#each Object.entries(races) as [race, image]}
				<div class="onerace">
					<button on:click={() => handleVisible(race)} class="choose">{race}</button>
					<img src="/arts/{image}" alt="" />
				</div>
			{/each}
		</div>
	{:else if loading && !visible}
		<div class="loading">Loading...</div>
	{/if}

	<div class="detailcontainer">
		{#if visible}
			<RaceDetails bind:visible {currentRace} />
		{/if}
	</div>
</div>

<style>
	.main {
		justify-content: start;
		place-items: start;
		height: 100%;
		background: var(--gradient, linear-gradient(180deg, #2c3146 0%, #595b67 50.17%, #191726 100%));
		overflow-x: hidden;
	}
	.main2 {
		height: 100vh;
	}
	.loading {
		height: 100vh;
	}
	.detailcontainer {
		display: flex;
		justify-content: center;
		flex-direction: column;
		place-items: center;
		overflow-x: hidden;
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

	@media (min-width: 900px) {
		h1 {
			font-size: 40px;
		}
		.onerace {
			width: 400px;
		}
		.races {
			display: grid;
			grid-template-columns: 400px 400px;
			column-gap: 60px;
			margin-bottom: 80px;
		}
		.detailcontainer {
			position: absolute;
			width: 100vw;
			top: 0px;
			left: 0px;
			background: var(--gradient, linear-gradient(180deg, #2c3146 0%, #595b67 50.17%, #191726 100%));
			overflow-x: hidden;
		}
	}
</style>
