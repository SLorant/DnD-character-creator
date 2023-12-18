<script lang="ts">
	import { rollDice } from './dice';
	import { goto } from '$app/navigation';
	let result = 1;
	let numberOfSides = 6;

	function roll() {
		rollDice(numberOfSides).subscribe((value: number) => {
			result = value;
		});
	}

	function updateNumberOfSides(event: InputEvent) {
		const inputElement = event.target as HTMLInputElement;
		const newNumberOfSides = parseInt(inputElement.value, 10);

		if (!isNaN(newNumberOfSides) && newNumberOfSides > 0) {
			numberOfSides = newNumberOfSides;
		}
	}
</script>

<div class="main">
	<h1>Dice Roller</h1>
	<label for="numberOfSides">Number of sides:</label>
	<input type="number" id="numberOfSides" bind:value={numberOfSides} on:input={() => updateNumberOfSides} />

	<button on:click={roll}>Roll</button>
	<h2>You rolled...</h2>
	<p class="result">{result}</p>
	<button class="home" on:click={() => goto('/')}>Back to home</button>
</div>

<style>
	.main {
		justify-content: center;
	}
	h2 {
		color: #cdf8fb;
	}
	label {
		color: #cdf8fb;
		font-size: 24px;
	}
	.result {
		font-size: 40px;
		color: white;
	}
	button {
		cursor: pointer;
		width: 50%;
		font-size: 25px;
		border-radius: none;
		border: none;
		background: rgba(255, 255, 255, 0.7);

		border: 2px solid black;
		background-color: #7aca8b;
	}
	.home {
		margin-top: 40px;
		background: rgba(255, 255, 255, 0.7);
		font-size: 20px;
		padding: 6px;
		border: none;
		border-radius: 5px;
	}
	input {
		height: 30px;
		font-size: 25px;
		width: 200px;
		margin-top: 30px;
		margin-bottom: 30px;
		outline: none;
	}
</style>
