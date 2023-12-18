<script lang="ts">
	import type { apiData } from './features';
	let selectedFeatures: string[] = [];
	export let charclass: string;

	const traitStates: Record<string, boolean> = {};
	function toggleDescription(trait: string) {
		if (selectedFeatures.includes(trait)) {
			selectedFeatures = selectedFeatures.filter((selectedFeature) => selectedFeature !== trait);
			traitStates[trait] = false;
		} else {
			selectedFeatures = [...selectedFeatures, trait];
			traitStates[trait] = true;
		}
	}

	let classData: apiData;
	let traitUrls: any;
	let loading = true;
	async function fetchData() {
		try {
			const response = await fetch(`https://www.dnd5eapi.co/api/classes/${charclass}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
				}
			});
			if (response.ok) {
				const responseData = await response.json();
				classData = responseData;
				console.log(classData);
				loading = false;
			} else {
				console.error('Failed to fetch race data');
			}
		} catch (error) {
			console.error('Error while fetching race data: ' + error);
		}
	}

	fetchData();

	type Features = {
		[traitIndex: string]: string;
	};

	type FeatureDescriptions = {
		[traitIndex: string]: any;
	};

	let traitDescriptions: FeatureDescriptions;
	let featureDescriptions: FeatureDescriptions;
	let spells: Features;
	let classDetails: any;
	let done = false;
	$: {
		if (classData) {
			if (!done) {
				featureDescriptions = { ...classData };
				if (featureDescriptions.spellcasting) {
					spells = classData.spellcasting.info.reduce((featureObject: Features, featureData) => {
						featureObject[featureData.name] = featureData.desc;
						return featureObject;
					}, {});
				}

				delete featureDescriptions.index;
				delete featureDescriptions.url;
				delete featureDescriptions.multi_classing;
				delete featureDescriptions.class_levels;
				delete featureDescriptions.spells;
				delete featureDescriptions.starting_equipment;
				delete featureDescriptions.name;
				delete featureDescriptions.saving_throws;
				delete featureDescriptions.subclasses;
				delete featureDescriptions.spellcasting;
				delete Object.assign(featureDescriptions, { ['Hit die']: featureDescriptions['hit_die'] })['hit_die'];
				if (featureDescriptions['proficiency_choices']) {
					delete Object.assign(featureDescriptions, {
						['Proficiency choices']: featureDescriptions['proficiency_choices']
					})['proficiency_choices'];
					delete featureDescriptions.proficiency_choices;
				}
				if (featureDescriptions['saving_throws']) {
					delete Object.assign(featureDescriptions, {
						['Saving throws']: featureDescriptions['saving_throws']
					})['saving_throws'];
					delete featureDescriptions.saving_throws;
				}
				if (featureDescriptions['starting_equipment_options']) {
					delete Object.assign(featureDescriptions, {
						['Starting equipment']: featureDescriptions['starting_equipment_options']
					})['starting_equipment_options'];
					delete featureDescriptions.starting_equipment_options;
				}
				if (featureDescriptions['proficiencies']) {
					delete Object.assign(featureDescriptions, {
						['Proficiencies']: featureDescriptions['proficiencies']
					})['proficiencies'];
					delete featureDescriptions.proficiencies;
				}

				console.log(featureDescriptions);
			}
		}
		if (traitUrls && !done) {
			Promise.all(traitUrls.map(fetchFeatureDescription))
				.then(() => {
					done = true;
				})
				.catch((error) => {
					console.error(`Error while fetching trait descriptions: ${error}`);
				});
		}
	}

	async function fetchFeatureDescription(url: string) {
		url = 'https://www.dnd5eapi.co' + url;
		try {
			const response = await fetch(url);
			if (response.ok) {
				const traitData = await response.json();
				if (traitData.index && traitData.desc) {
					traitDescriptions[traitData.index] = traitData.desc.join('\n');
				}
			} else {
				console.error(`Failed to fetch trait description from URL: ${url}`);
			}
		} catch (error) {
			console.error(`Error while fetching trait description: ${error}`);
		}
		if (classDetails) console.log(Object.keys(classDetails.proficiency_choices).length);
	}
</script>

<div class="traitlist">
	{#if featureDescriptions}
		{#each Object.entries(featureDescriptions) as [traitIndex, traitName]}
			<button class="trait" class:expanded={traitStates[traitIndex]} on:click={() => toggleDescription(traitIndex)}>
				<p>{traitIndex}</p>
				{#if selectedFeatures.includes(traitIndex)}
					{#if traitIndex == 'Proficiency choices'}
						{#each traitName as proficiency}
							<div class="traitdesc">
								<p class="desctext">{proficiency.desc}</p>
							</div>
						{/each}
					{:else if traitIndex == 'Proficiencies'}
						{#each traitName as proficiency}
							<div class="traitdesc">
								<p class="desctext">{proficiency.name}</p>
							</div>
						{/each}
					{:else if traitIndex == 'Saving throws'}
						{#each traitName as proficiency}
							<div class="traitdesc">
								<p class="desctext">{proficiency.name}</p>
							</div>
						{/each}
					{:else if traitIndex == 'Starting equipment'}
						{#each traitName as proficiency}
							<div class="traitdesc">
								<p class="desctext">{proficiency.desc}</p>
							</div>
						{/each}
					{:else}
						<div style="" class="traitdesc">
							<p class="desctext">{traitName}</p>
						</div>
					{/if}
				{/if}
			</button>
		{/each}
		{#if spells}
			{#each Object.entries(spells) as [spellIndex, spellName]}
				<button class="trait" class:expanded={traitStates[spellIndex]} on:click={() => toggleDescription(spellIndex)}>
					<p>{spellIndex}</p>
					{#if selectedFeatures.includes(spellIndex)}
						<div class="traitdesc">
							<p class="desctext">{spellName}</p>
						</div>
					{/if}
				</button>
			{/each}
		{/if}
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
		padding-bottom: 0px;
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
	@media (min-width: 600px) {
		.trait {
			width: 500px;
		}
	}
	@media (min-width: 900px) {
		.trait {
			width: 400px;
		}
		.traitlist {
			display: grid;
			grid-template-columns: 400px 400px;
			min-height: 54vh;
		}
	}
</style>
