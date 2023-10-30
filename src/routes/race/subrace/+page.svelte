<script lang="ts">
	import { fly } from 'svelte/transition';
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
	const selectedRace = localStorage.getItem('race') ?? 'hum';
	console.log(selectedRace);
</script>

<div class="main">
	<div class="progressbar" />
	<h1>Choose your race</h1>
	<div class="races">
		{#each Object.entries(races) as [race, image]}
			<div class="onerace">
				<a href={race}>{race}</a>
				<img src="/bard.jpg" alt="" />
				<button on:click={() => handleVisible(race)} class="info" />
			</div>
		{/each}
	</div>
</div>

<style>
	.main {
		justify-content: start;
		place-items: start;
	}
	.races {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		row-gap: 20px;
	}
	.onerace {
		width: 100%;
		height: 180px;
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
