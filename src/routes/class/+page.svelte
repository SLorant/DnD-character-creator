<script lang="ts">
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ClassDetails from './ClassDetails.svelte';
	interface classes {
		[name: string]: string;
	}
	let classes: classes = {};
	let loading = true;
	let visible = false;
	let currentClass = ['human', 'human.jpg'];
	function handleVisible(charclass: string) {
		visible = !visible;
		const searchClass = Object.keys(classes).find((key) => key === charclass) ?? 'human';
		const searchClassImage = Object.values(classes).find((key) => key === charclass + '.jpg') ?? 'human.jpg';
		currentClass = [searchClass, searchClassImage];
	}
	let db: IDBDatabase;

	onMount(() => {
		fetchData();
	});

	async function fetchData() {
		try {
			const response = await fetch(`https://www.dnd5eapi.co/api/classes`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
				}
			});
			if (response.ok) {
				const responseData = await response.json();
				console.log(responseData);
				responseData.results.forEach((charclass: any) => {
					classes[charclass.index] = charclass.index + '.jpg';
				});
				loading = false;
				// Continue fetching trait descriptions here, if needed
			} else {
				console.error('Failed to fetch charclass data');
			}
		} catch (error) {
			console.error('Error while fetching charclass data: ' + error);
		}
	}

	// Fetch data when the component is created
</script>

<div class="main" class:main2={visible}>
	<div class="progressbar" />
	<h1>Choose your class</h1>
	{#if !loading && !visible}
		<div class="classes">
			{#each Object.entries(classes) as [charclass, image]}
				<div class="onecharclass">
					<button on:click={() => handleVisible(charclass)} class="choose">{charclass}</button>
					<img src="/bard.jpg" alt="" />
				</div>
			{/each}
		</div>
	{:else if loading && !visible}
		<div class="loading">Loading...</div>
	{/if}
	<div class="detailcontainer">
		{#if visible}
			<ClassDetails bind:visible {currentClass} />
		{/if}
	</div>
</div>

<style>
	.main {
		justify-content: start;
		place-items: start;
		height: 100%;
	}
	.main2 {
		height: 100vh;
	}
	.loading {
		height: 100vh;
	}
	.classes {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		place-items: center;
		row-gap: 30px;
		margin-bottom: 30px;
	}
	.onecharclass {
		width: calc(100% - 60px);
		height: 150px;
		position: relative;
		display: flex;
		justify-content: center;
		place-items: center;
	}
	.choose {
		color: #cdf8fb;
		background: none;
		border: none;
		text-decoration: none;
		display: flex;
		justify-content: center;
		place-items: center;
		z-index: 20;
		font-weight: bold;
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: #cdf8fb;
		font-size: 30px;
		cursor: pointer;
		width: 100%;
		height: 100%;
	}
	img {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0px;
		border-radius: 20px;
		object-fit: cover;
		opacity: 0.4;
	}
	.detailcontainer {
		display: flex;
		justify-content: center;
		flex-direction: column;
		place-items: center;
		overflow-x: hidden !important;
	}
	@media (min-width: 900px) {
		h1 {
			font-size: 40px;
		}
		.onecharclass {
			width: 400px;
		}
		.classes {
			display: grid;
			grid-template-columns: 400px 400px;
			column-gap: 60px;
			margin-bottom: 80px;
		}
		.detailcontainer {
			position: absolute;
			width: 98vw;
			top: 0px;
			left: 0px;
			background: var(--gradient, linear-gradient(180deg, #2c3146 0%, #595b67 50.17%, #191726 100%));
			overflow-x: hidden;
		}
	}
</style>
