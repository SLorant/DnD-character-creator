<script lang="ts">
	import { fly } from 'svelte/transition';
	import IntroText from './IntroText.svelte';
	import RaceDetails from './RaceDetails.svelte';
	import { goto } from '$app/navigation';
	let races = {
		aasimar: 'aasimar.jpg',
		human: 'human.jpg',
		elf: 'elf.jpg',
		dwarf: 'dwarf.jpg'
	};
	let visible = false;
	let currentRace = ['human', 'human.jpg'];
	function handleVisible(race: string) {
		visible = !visible;
		const searchRace = Object.keys(races).find((key) => key === race) ?? 'human';
		const searchRaceImage = Object.values(races).find((key) => key === race + '.jpg') ?? 'human.jpg';
		currentRace = [searchRace, searchRaceImage];
	}
	function goToNext(race: string) {
		localStorage.setItem('race', race);
		if (race === 'human') {
			goto('/race/subrace');
		}
	}
</script>

<div class="main">
	<div class="progressbar" />
	<h1>Choose your race</h1>
	<div class="races">
		{#each Object.entries(races) as [race, image]}
			<div class="onerace">
				<button on:click={() => handleVisible(race)} class="choose">{race}</button>
				<img src="/bard.jpg" alt="" />
			</div>
		{/each}
	</div>
	{#if visible}
		<RaceDetails bind:visible {currentRace} />
		<button class="choose" on:click={() => goToNext(currentRace[0])}>{currentRace[0]}</button>
	{/if}
</div>

<style>
	.main {
		justify-content: start;
		place-items: start;
	}
	.races {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		place-items: center;
		row-gap: 20px;
	}
	.onerace {
		width: 350px;
		height: 150px;
		position: relative;
		display: flex;
		justify-content: center;
		place-items: center;
	}
	.info {
		position: absolute;
		bottom: 0px;
		right: 20px;
		width: 40%;
		border-radius: 20px 0px;
		height: 25%;
		background-color: #221856;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 30;
		border: none;
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
		width: 80%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 20px;
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
