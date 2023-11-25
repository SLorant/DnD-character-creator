<script lang="ts">
	import { getRaceFromIndexedDB, initializeIndexedDB } from '../indexedDBUtil';
	import { onMount } from 'svelte';
	let db: any;
	let race: any;
	let bonuses: any;
	let info = '';

	let points = 27;
	type Attributes = {
		Strength: number;
		Dexterity: number;
		Constitution: number;
		Intelligence: number;
		Wisdom: number;
		Charisma: number;
	};

	type AbilityScore = {
		index: string;
		name: string;
		url: string;
	};
	type Ability = {
		ability_score: AbilityScore;
		bonus: 2;
	};
	let attributes: Attributes = {
		Strength: 8,
		Dexterity: 8,
		Constitution: 8,
		Intelligence: 8,
		Wisdom: 8,
		Charisma: 8
	};

	onMount(async () => {
		try {
			db = await initializeIndexedDB();
			console.log('IndexedDB initialized');
			race = await getRaceFromIndexedDB(db);
			bonuses = await fetchData();
			info = await handleRaceScores(bonuses);
		} catch (error) {
			console.error('Error initializing IndexedDB', error);
		}
	});
	async function fetchData() {
		let bonuses;
		try {
			const response = await fetch(`https://www.dnd5eapi.co/api/races/${race}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
				}
			});
			if (response.ok) {
				const responseData = await response.json();
				console.log(responseData);
				bonuses = responseData.ability_bonuses;
				return bonuses;
				// Continue fetching trait descriptions here, if needed
			} else {
				console.error('Failed to fetch race data');
			}
		} catch (error) {
			console.error('Error while fetching race data: ' + error);
		}
	}
	async function handleRaceScores(bonuses: any) {
		let info = '';
		bonuses.forEach((ability: Ability) => {
			const bonusAttr = Object.keys(attributes).find((attr) =>
				attr.toLowerCase().startsWith(ability.ability_score.index)
			);
			console.log(bonusAttr);
			if (bonusAttr) {
				attributes[bonusAttr as keyof Attributes] += ability.bonus;
				info += `you get +${ability.bonus} ability score to ${bonusAttr}.`;
			}
		});
		return info;
	}

	const addScore = (attribute: string) => {
		let current = attributes[attribute as keyof Attributes];
		if (current < 15 && points > 0) {
			attributes[attribute as keyof Attributes]++;
			if (current == 13 || current == 14) points = points - 2;
			else points--;
		}
	};
</script>

<main class="main">
	<h1>Point Buy Calculator</h1>

	<div class="attributes">
		<div class="pointbuy">
			{#each Object.entries(attributes) as [attribute, score]}
				<div>
					<p>{attribute}: {score}</p>
					<button on:click={() => addScore(attribute)}>+</button>
				</div>
			{/each}
		</div>
		<div>
			{#if bonuses !== undefined}
				<p>Because you are {race}, {info}</p>
			{/if}
		</div>
	</div>

	<p>Points remaining: {points}</p>
</main>

<style>
	p {
		color: white;
	}
	.pointbuy {
		display: flex;
		flex-direction: column;
	}
</style>
