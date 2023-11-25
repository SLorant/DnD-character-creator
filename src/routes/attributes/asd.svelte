<script lang="ts">
	import { getRaceFromIndexedDB, initializeIndexedDB } from '../indexedDBUtil';
	import { onMount } from 'svelte';
	import { PDFDocument } from 'pdf-lib';
	import { from, forkJoin } from 'rxjs';
	import { switchMap, catchError } from 'rxjs/operators';

	let db: any;
	let race: any;
	let bonuses: any;
	let characterData: any;

	onMount(async () => {
		try {
			db = await initializeIndexedDB();
			console.log('IndexedDB initialized');
			race = await getRaceFromIndexedDB(db);
			bonuses = await fetchData();
			characterData = await getCharacterDataFromIndexedDB();
		} catch (error) {
			console.error('Error initializing IndexedDB', error);
		}
	});

	const fetchData = () => {
		return from(
			fetch(`https://www.dnd5eapi.co/api/races/${race}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
				}
			})
		).pipe(
			switchMap((response) => (response.ok ? from(response.json()) : throwError('Failed to fetch race data'))),
			catchError((error) => {
				console.error('Error while fetching race data: ' + error);
				return throwError('Failed to fetch race data');
			})
		);
	};

	const getCharacterDataFromIndexedDB = () => {
		// Assume you have a function to get the character data from IndexedDB
		// Modify this function according to your data structure
		// For example, you can use the same approach you used for getRaceFromIndexedDB
		return from(new Promise((resolve) => resolve({})));
	};

	const exportToPDF = () => {
		const pdfObservable = from(fetch('path/to/your/fillable_character_sheet.pdf').then((res) => res.arrayBuffer()));

		forkJoin([pdfObservable, fetchData(), getCharacterDataFromIndexedDB()])
			.pipe(
				switchMap(([pdfBytes, raceData, characterData]) => {
					return from(PDFDocument.load(pdfBytes)).pipe(
						switchMap((pdfDoc) => {
							const form = pdfDoc.getForm();
							form.getTextField('characterName').setText(characterData.name);
							form.getTextField('race').setText(race);
							form.getTextField('bonuses').setText(raceData.ability_bonuses[0].bonus);

							// Add more form filling logic here based on your PDF

							return from(pdfDoc.save());
						})
					);
				}),
				catchError((error) => {
					console.error('Error exporting to PDF', error);
					return throwError('Error exporting to PDF');
				})
			)
			.subscribe((modifiedPdfBytes) => {
				// Save or send the modified PDF as needed
				// You can use the FileSaver library to trigger a download
				// Example: saveAs(new Blob([modifiedPdfBytes]), 'filled_character_sheet.pdf');
			});
	};
</script>

<main class="main">
	<h1>Point Buy Calculator</h1>

	<div class="attributes">
		{#each Object.entries(attributes) as [attribute, score]}
			<div>
				<p>{attribute}: {score}</p>
				<button on:click={() => addScore(attribute)}>+</button>
			</div>
		{/each}
		<div>
			{#if bonuses !== null}
				{race}, {bonuses}
				<button on:click={exportToPDF}>Export to PDF</button>
			{/if}
		</div>
	</div>

	<p>Points remaining: {points}</p>
</main>

<style>
	p {
		color: white;
	}
</style>
