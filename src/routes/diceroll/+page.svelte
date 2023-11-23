<script lang="ts">
	import { rollDice } from './dice';
	let result = 1;

	function roll() {
		rollDice(12).subscribe((value: number) => {
			result = value;
		});
	}
</script>

<h1>Dice Roller</h1>

<button on:click={roll}>Roll</button>
<p>Result: {result}</p>
