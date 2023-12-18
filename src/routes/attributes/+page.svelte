<script lang="ts">
	import { getCharacterDataFromIndexedDB, initializeIndexedDB, addToIndexedDB } from '../indexedDBUtil';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import BackArrow from '../BackArrow.svelte';
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
	let endattributes: Attributes = {
		Strength: 8,
		Dexterity: 8,
		Constitution: 8,
		Intelligence: 8,
		Wisdom: 8,
		Charisma: 8
	};

	async function goToNext(attributes: Attributes) {
		try {
			const result = await addToIndexedDB(db, attributes, 'attributes');
			goto('/summary');
		} catch (error) {
			console.error(error);
		}
	}

	onMount(async () => {
		try {
			db = await initializeIndexedDB();
			console.log('IndexedDB initialized');
			race = await getCharacterDataFromIndexedDB('race', db);
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
				bonuses = responseData.ability_bonuses;
				return bonuses;
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
			const bonusAttr = Object.keys(endattributes).find((attr) =>
				attr.toLowerCase().startsWith(ability.ability_score.index)
			);
			if (bonusAttr) {
				endattributes[bonusAttr as keyof Attributes] += ability.bonus;
				info += ` you get +${ability.bonus} ability score to ${bonusAttr}.`;
			}
		});
		return info;
	}

	const addScore = (attribute: string) => {
		let current = attributes[attribute as keyof Attributes];
		if (current < 15 && points > 0 && !((current == 13 || current == 14) && points == 1)) {
			attributes[attribute as keyof Attributes]++;
			endattributes[attribute as keyof Attributes]++;
			if (current == 13 || current == 14) points = points - 2;
			else points--;
		}
	};
	const removeScore = (attribute: string) => {
		let current = attributes[attribute as keyof Attributes];
		if (current > 8 && points < 27) {
			attributes[attribute as keyof Attributes]--;
			endattributes[attribute as keyof Attributes]--;
			if (current == 14 || current == 15) points = points + 2;
			else points++;
		}
	};
</script>

<head>
	<title>Attributes</title>
</head>

<main class="main">
	<h1>Point Buy Calculator</h1>

	<div class="attributes">
		<p>Points remaining: {points}</p>

		<div class="pointbuy">
			{#each Object.entries(attributes) as [attribute, score]}
				<div class="attr">
					<p>{attribute}</p>
					<div class="small">
						<button on:click={() => removeScore(attribute)}>-</button>
						<p>{score}</p>
						<button on:click={() => addScore(attribute)}>+</button>
					</div>
				</div>
			{/each}
		</div>
		<div class="info">
			{#if bonuses !== undefined}
				{#if race === 'human'}
					<p>Because you are a human, you get +1 to everything.</p>
				{:else}
					<p>Because you are {race}, {info}</p>
				{/if}
			{/if}
		</div>
	</div>
	<div class="attributes">
		<h1 class="with">With bonuses</h1>
		<div class="bonuses">
			{#each Object.entries(endattributes) as [attribute, score]}
				<div class="attr">
					<p>{attribute} : {score}</p>
				</div>
			{/each}
		</div>
	</div>
	<div class="chooser">
		<button class="chooserace" on:click={() => goToNext(endattributes)}>See summary</button>
	</div>
	<div class="arrow">
		<BackArrow where={'class'} />
	</div>
</main>

<style>
	.main {
		justify-content: start;
		min-height: 110vh;
	}
	.arrow {
		position: absolute;
		top: -20px;
		left: 0px;
	}
	h1 {
		margin-bottom: 0px;
		margin-top: 60px;
	}
	.with {
		margin-top: 10px;
		margin-bottom: 20px;
	}
	p {
		font-size: 18px;
		color: white;
	}
	.attributes {
		display: flex;
		flex-direction: column;
		justify-content: center;
		place-items: center;
	}
	.pointbuy {
		display: grid;
		grid-template-columns: 120px 120px 120px;
	}
	.attr {
		border: 1px solid white;
		text-align: center;
		display: flex;
		flex-direction: column;
		border-radius: 0px;
	}

	.bonuses {
		display: grid;
		grid-template-columns: 180px 180px;
	}
	.small {
		display: flex;
		justify-content: center;
		place-items: center;
		gap: 20px;
		font-size: 20px;
	}
	.info {
		width: 85%;
		text-align: center;
	}
	button {
		cursor: pointer;
		width: 30px;
		border-radius: 5px;
		font-size: 25px;
		border-radius: none;
		border: none;
		background: rgba(255, 255, 255, 0.7);
	}

	.chooserace {
		border: 2px solid black;
		background-color: #7aca8b;
		width: 200px;
		padding: 6px;
		margin-top: 40px;
	}
	@media only screen and (min-height: 900px) {
		.main {
			min-height: auto;
		}
	}
	@media (min-width: 900px) {
		.pointbuy {
			display: grid;
			grid-template-columns: 200px 200px 200px;
		}
	}
</style>
