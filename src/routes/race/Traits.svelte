<script lang="ts">
	import alltraits from '../../assets/traits.json';
	import type TraitsData from './traits';
	let selectedTraits: string[] = [];
	export let race: string;
	// let traits =
	// 	Object.entries(alltraits).find(([name, desc]) => {
	// 		name === race;
	// 	})?.[1] ?? {};
	let traits2: TraitsData = alltraits;
	let traits = traits2[race] || {}; // Use direct property access;
	console.log(traits);
	function toggleDescription(trait: string) {
		if (selectedTraits.includes(trait)) {
			selectedTraits = selectedTraits.filter((selectedTrait) => selectedTrait !== trait);
		} else {
			selectedTraits = [...selectedTraits, trait];
		}
	}
</script>

<div class="traitlist">
	{#each Object.entries(traits) as [trait, desc]}
		<button class="trait" on:click={() => toggleDescription(trait)}>
			<p>{trait}</p>
		</button>
		{#if selectedTraits.includes(trait)}
			<div class="trait-description">
				<p>{desc}</p>
			</div>
		{/if}
	{/each}
</div>

<style>
	.traitlist {
		display: flex;
		justify-content: center;
		place-items: center;
		flex-direction: column;
		width: 100%;
		gap: 20px;
		margin-top: 30px;
	}
	.trait {
		width: 80%;
		border-radius: 5px;
		height: 30px;
		display: flex;
		border: 1px solid #111;
		border-bottom: 1px dashed;
		justify-content: center;
		place-items: center;
	}
</style>
