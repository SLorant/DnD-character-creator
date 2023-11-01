<script lang="ts">
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
	interface apiData {
		index: string;
		name: string;
		speed: number;
		age: string;
		size: string;
		size_description: string;
		ability_bonuses: {
			ability_score: {
				index: string;
				name: string;
				url: string;
			};
			bonus: number;
		}[];
		alignment: string;
		language_desc: string;
		traits: {
			index: string;
			name: string;
			url: string;
		}[];
		starting_proficiencies: never[];
		languages: {
			index: string;
			name: string;
			url: string;
		}[];
		subraces: never[];
		url: string;
	}

	let raceData: apiData;
	let traitUrls: any;

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
				console.log(raceData);
				traitUrls = raceData.traits.map((trait) => trait.url); // Moved traitUrls assignment here
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
		[traitIndex: string]: string; // Replace string with the actual type of trait descriptions
	};

	let traitDescriptions: TraitDescriptions;
	let traits: Traits;
	let raceDetails: any;
	let done = false;
	let traitsalldone = false;
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
			}

			raceDetails = {
				name: raceData.name,
				speed: raceData.speed,
				alignment: raceData.alignment,
				age: raceData.age,
				size: raceData.size,
				size_description: raceData.size_description,
				starting_proficiencies: raceData.starting_proficiencies,
				languagearray: raceData.languages.map((language) => language.name),
				traitarray: raceData.traits.map((trait) => trait.name)
			};
			traitUrls = raceData.traits.map((trait) => trait.url);

			traits['age'] = 'Age';
		}
		if (traitUrls && !done) {
			Promise.all(traitUrls.map(fetchTraitDescription))
				.then(() => {
					// Now, you have all trait descriptions in the traitDescriptions object
					console.log(traitDescriptions);
					done = true;
				})
				.catch((error) => {
					console.error(`Error while fetching trait descriptions: ${error}`);
				});
		}
		if (traitDescriptions && traitDescriptions.age) {
			traitDescriptions = {
				age: traitDescriptions.age,
				...traitDescriptions
			};
			traitsalldone = true;
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
	{#if traits && raceDetails && traitsalldone}
		<div class="race-details">
			<p>Speed: {raceDetails.speed}</p>
			<p>Alignment: {raceDetails.alignment}</p>
			<p>Age: {raceDetails.age}</p>
			<p>Size: {raceDetails.size}</p>
			<p>Size Description: {raceDetails.size_description}</p>

			{#if Object.keys(raceDetails.starting_proficiencies).length > 1}
				<h3>Starting Proficiencies:</h3>
				<ul>
					{#each raceDetails.starting_proficiencies as proficiency}
						<li>{proficiency.index}</li>
					{/each}
				</ul>
			{/if}
			<h3>Languages:</h3>
			<ul>
				{#each raceDetails.languagearray as language}
					<li>{language}</li>
				{/each}
			</ul>
		</div>
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
	{/if}
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
</style>
