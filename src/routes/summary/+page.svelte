<script lang="ts">
	import { getCharacterDataFromIndexedDB, initializeIndexedDB } from '../indexedDBUtil';
	import { onMount } from 'svelte';
	import { PDFDocument, PDFTextField } from 'pdf-lib';
	import { from, forkJoin, throwError } from 'rxjs';
	import { switchMap, catchError } from 'rxjs/operators';
	import { saveAs } from 'file-saver';
	import type { an } from 'vitest/dist/types-198fd1d9';

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
							// const fields = form.getFields();
							// fields.forEach((field) => {
							// 	const type = field.constructor.name;
							// 	const name = field.getName();
							// 	//console.log(`${type}: ${name}`);
							// 	if (name.trim().toLowerCase() == 'dexmod') {
							// 		console.log(name);
							// 		let field2 = field as PDFTextField;
							// 		field2.setText(race);
							// 	}
							// });
							// console.log(attributes);
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

<div class="main">
	<h1>Summary</h1>

	<button on:click={exportToPDF}>Export to pdf!</button>
</div>

<style>
	p {
		color: white;
	}
</style>
