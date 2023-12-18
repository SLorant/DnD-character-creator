<script lang="ts">
	import { getCharacterDataFromIndexedDB, initializeIndexedDB } from '../indexedDBUtil';
	import { onMount } from 'svelte';
	import { PDFDocument, PDFTextField } from 'pdf-lib';
	import { from, forkJoin, throwError } from 'rxjs';
	import { switchMap, catchError } from 'rxjs/operators';
	import { saveAs } from 'file-saver';
	import { goto } from '$app/navigation';

	let db: any;
	let race: any;
	let attributes: any;
	let name: any;
	let characterClass: any;
	const fieldMappings: Record<string, string[]> = {
		Strength: ['STR', 'STRmod'],
		Dexterity: ['DEX', 'DEXmod'],
		Constitution: ['CON', 'CONmod'],
		Intelligence: ['INT', 'INTmod'],
		Wisdom: ['WIS', 'WISmod'],
		Charisma: ['CHA', 'CHamod']
	};

	onMount(async () => {
		try {
			db = await initializeIndexedDB();
			console.log('IndexedDB initialized');
			race = await getCharacterDataFromIndexedDB('race', db);
			characterClass = await getCharacterDataFromIndexedDB('class', db);
			name = await getCharacterDataFromIndexedDB('name', db);
			attributes = await getCharacterDataFromIndexedDB('attributes', db);
		} catch (error) {
			console.error('Error initializing IndexedDB', error);
		}
	});

	const exportToPDF = () => {
		const pdfObservable = from(fetch('/sheet.pdf').then((res) => res.arrayBuffer()));

		forkJoin([pdfObservable, getCharacterDataFromIndexedDB('race', db)])
			.pipe(
				switchMap(([pdfBytes]) => {
					return from(PDFDocument.load(pdfBytes)).pipe(
						switchMap((pdfDoc) => {
							const form = pdfDoc.getForm();
							Object.entries(attributes).forEach((attr) => {
								const attributeName = attr[0];
								const attributeValue = attr[1] as number;

								const fieldNames = fieldMappings[attributeName];
								const newValue = Math.floor((attributeValue - 10) / 2);

								form.getTextField(fieldNames[0]).setText(newValue.toString());

								try {
									form.getTextField(fieldNames[1]).setText(attributeValue.toString());
								} catch (error) {
									form.getTextField(fieldNames[1] + ' ').setText(attributeValue.toString());
								}
							});
							form.getTextField('CharacterName').setText(name);
							form.getTextField('ClassLevel').setText(characterClass);

							form.getTextField('Race ').setText(race);

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
				const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
				saveAs(blob, 'filled_character_sheet.pdf');
			});
	};
</script>

<head>
	<title>Summary</title>
</head>
<div class="main">
	<h1>Summary</h1>
	<div>
		<p>Name: {name}</p>
		<p>Race: {race}</p>
		<p>Class: {characterClass}</p>
	</div>
	<button on:click={exportToPDF}>Export to pdf!</button>
	<button class="home" on:click={() => goto('/')}>Back to home</button>
</div>

<style>
	.main {
		justify-content: center;
	}
	p {
		font-size: 20px;
		color: white;
	}
	h1 {
		font-size: 40px;
	}
	button {
		cursor: pointer;
		border-radius: 5px;
		font-size: 25px;
		border-radius: none;
		border: 2px solid black;
		background-color: #7aca8b;
		width: 200px;
		padding: 6px;
		margin-top: 40px;
		margin-bottom: 40px;
	}
	.home {
		margin-top: 0px;
		background: rgba(255, 255, 255, 0.7);
	}
</style>
