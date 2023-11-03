<script lang="ts">
	import type { apiData } from './traits';
	let selectedTraits: string[] = [];
	export let race: string;

	const traitStates: Record<string, boolean> = {};
	function toggleDescription(trait: string) {
		if (selectedTraits.includes(trait)) {
			selectedTraits = selectedTraits.filter((selectedTrait) => selectedTrait !== trait);
			traitStates[trait] = false;
		} else {
			selectedTraits = [...selectedTraits, trait];
			traitStates[trait] = true;
		}
	}

	let raceData: apiData;
	let traitUrls: any;
	let loading = true;
	async function fetchData() {
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
				raceData = responseData;
				traitUrls = raceData.traits.map((trait) => trait.url); // Moved traitUrls assignment here
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
	fetchData();

	type Traits = {
		[traitIndex: string]: string;
	};

	type TraitDescriptions = {
		[traitIndex: string]: any; // Replace string with the actual type of trait descriptions
	};

	let traitDescriptions: TraitDescriptions;
	let featureDescriptions: TraitDescriptions;
	let traits: Traits;
	let features: Traits;
	let raceDetails: any;
	let done = false;
	$: {
		if (raceData) {
			traits = raceData.traits.reduce((traitObject: Traits, traitData) => {
				traitObject[traitData.index] = traitData.name;
				return traitObject;
			}, {});

			if (!done) {
				traitDescriptions = raceData.traits.reduce((descObject: TraitDescriptions, traitData) => {
					descObject[traitData.index] = traitData.name; // Replace this with the actual description from the API
					return descObject;
				}, {});
				featureDescriptions = { ...raceData };

				delete featureDescriptions.index;
				delete featureDescriptions.url;
				delete featureDescriptions.traits;
				delete featureDescriptions.languages;
				delete featureDescriptions.size;
				delete featureDescriptions.name;
				delete featureDescriptions.subraces;
				delete featureDescriptions.language_options;
				delete Object.assign(featureDescriptions, { ['Age']: featureDescriptions['age'] })['age'];
				delete Object.assign(featureDescriptions, { ['Speed']: featureDescriptions['speed'] })['speed'];
				delete Object.assign(featureDescriptions, { ['Size']: featureDescriptions['size_description'] })[
					'size_description'
				];
				delete Object.assign(featureDescriptions, { ['Alignment']: featureDescriptions['alignment'] })['alignment'];
				if (featureDescriptions['starting_proficiencies']) {
					console.log(featureDescriptions['starting_proficiencies']);
					delete Object.assign(featureDescriptions, {
						['Starting proficiencies']: featureDescriptions['starting_proficiencies']
					})['starting_proficiencies'];
					delete featureDescriptions.starting_proficiencies;
				}
				if (featureDescriptions['starting_proficiency_options']) {
					delete Object.assign(featureDescriptions, {
						['Starting proficiencies']: featureDescriptions['starting_proficiency_options'].desc
					})['starting_proficiency_options'].desc;
					delete featureDescriptions.starting_proficiency_options;
				}
				delete Object.assign(featureDescriptions, { ['Languages']: featureDescriptions['language_desc'] })[
					'language_desc'
				];
				console.log(featureDescriptions['Starting proficiencies']);
			}

			traitUrls = raceData.traits.map((trait) => trait.url);
		}
		if (traitUrls && !done) {
			Promise.all(traitUrls.map(fetchTraitDescription))
				.then(() => {
					// Now, you have all trait descriptions in the traitDescriptions object
					done = true;
				})
				.catch((error) => {
					console.error(`Error while fetching trait descriptions: ${error}`);
				});
		}
	}

	// Function to fetch trait descriptions
	async function fetchTraitDescription(url: string) {
		url = 'https://www.dnd5eapi.co' + url;
		try {
			const response = await fetch(url);
			if (response.ok) {
				const traitData = await response.json();
				if (traitData.index && traitData.desc) {
					traitDescriptions['age'] = raceData.age;
					traitDescriptions[traitData.index] = traitData.desc.join('\n');
				}
			} else {
				console.error(`Failed to fetch trait description from URL: ${url}`);
			}
		} catch (error) {
			console.error(`Error while fetching trait description: ${error}`);
		}
		if (raceDetails) console.log(Object.keys(raceDetails.starting_proficiencies).length);
	}
</script>

<div class="traitlist">
	{#if traits}
		{#each Object.entries(featureDescriptions) as [traitIndex, traitName]}
			<button class="trait" class:expanded={traitStates[traitIndex]} on:click={() => toggleDescription(traitIndex)}>
				<p>{traitIndex}</p>
				{#if selectedTraits.includes(traitIndex)}
					{#if traitIndex == 'Starting proficiencies'}
						{#each traitName as proficiency}
							<div class="traitdesc">
								<p class="desctext">{proficiency.name}</p>
							</div>
						{/each}
					{:else}
						<div class="traitdesc">
							<p class="desctext">{traitName}</p>
						</div>
					{/if}
				{/if}
			</button>
		{/each}

		{#each Object.entries(traits) as [traitIndex, traitName]}
			<button class="trait" class:expanded={traitStates[traitIndex]} on:click={() => toggleDescription(traitIndex)}>
				<p>{traitName}</p>
				{#if selectedTraits.includes(traitIndex)}
					<div class="traitdesc">
						<p class="desctext">{traitDescriptions[traitIndex]}</p>
					</div>
				{/if}
			</button>
		{/each}
	{:else}
		<div class="loading">Loading...</div>
	{/if}
</div>

<style>
	.traitlist {
		display: flex;
		justify-content: center;
		place-items: center;
		flex-direction: column;
		width: 100%;
		gap: 25px;
		margin-top: 30px;
		margin-bottom: 30px;
	}
	.trait {
		width: calc(100vw - 40px);
		border-radius: 5px;
		font-size: 20px;
		height: 40px;
		display: flex;
		justify-content: center;
		border: none;
		flex-direction: column;
		place-items: center;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.7);
		box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.25);
	}
	.trait.expanded {
		height: max-content;
	}
	.desctext {
		font-size: 15px;
		padding-left: 20px;
		padding-right: 20px;
		padding-bottom: 10px;
		text-align: justify;
		font-family: sans-serif;
	}
	.loading {
		height: 600px;
		width: 100%;
		font-size: 40px;
		color: white;
		display: flex;
		justify-content: center;
	}
</style>
