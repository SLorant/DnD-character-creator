<script lang="ts">
	let showdesc = true;
	import IntroText from './IntroText.svelte';
	import { fly } from 'svelte/transition';
	import Traits from './Traits.svelte';
	export let visible: boolean;
	export let currentRace: string[];

	var myHeaders = new Headers();
	myHeaders.append('Accept', 'application/json');

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

	// fetch('https://www.dnd5eapi.co/api/races/tiefling', {
	// 	method: 'GET',
	// 	headers: myHeaders,
	// 	redirect: 'follow'
	// })
	// 	.then((response) => response.text())
	// 	.then((result) => console.log(result))
	// 	.catch((error) => console.log('error', error));
</script>

<div class="visible" class:descbg={showdesc} transition:fly={{ y: 200, duration: 200 }}>
	<img class="descimg" src={currentRace[1]} alt="" />
	<div class="header"><h1>{currentRace[0]}</h1></div>
	<button
		class="exit"
		on:click={() => {
			visible = false;
		}}>X</button
	>
	<div class="detailchoose">
		<button
			class="chooserbutton"
			class:showdesc
			on:click={() => {
				showdesc = true;
			}}>Description</button
		>
		<button
			class="chooserbutton traits"
			class:showdesc={!showdesc}
			on:click={() => {
				showdesc = false;
			}}>Traits</button
		>
	</div>
	{#if showdesc}
		<div class="detailintro">
			<IntroText />
		</div>
	{:else}
		<div class="detailintro">
			<Traits race={currentRace[0]} />
		</div>
	{/if}
</div>

<style>
	.visible {
		position: absolute;
		top: 0px;
		right: 0px;
		display: flex;
		flex-direction: column;
		width: 100%;
		background: var(--gradient, linear-gradient(180deg, #2c3146 0%, #595b67 50.17%, #191726 100%));
		z-index: 40;
	}
	.descbg {
		background: rgb(194, 194, 194);
	}
	h1 {
		color: white;
		font-size: 32px;
	}
	.descimg {
		width: 100%;
		height: 210px;
		opacity: 1;
		object-fit: cover;
		position: absolute;
		top: 0;
		right: 0;
	}
	.header {
		margin-top: 170px;
		display: flex;
		flex-direction: column;
		z-index: 100;
		justify-content: start;
		width: 100%;
		height: 90px;
		background: linear-gradient(0deg, #141414 55.26%, rgba(20, 20, 20, 0.45) 78.54%, rgba(20, 20, 20, 0) 97.42%);
		box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.25);
	}
	.exit {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 50px;
		border-radius: 20px;
		height: 50px;
		background-color: #6a6a83;
		font-size: 30px;
		z-index: 50;
		border: none;
	}
	.showdesc {
		background: rgba(20, 20, 20, 0.6) !important;
	}
	.detailchoose {
		display: flex;
		width: 100%;
		justify-content: center;
		place-items: center;
	}
	.detailintro {
		color: #14182d;
	}
	.chooserbutton {
		border: none;
		width: 50%;
		height: 40px;
		background-color: black;
		color: white;
		font-size: 20px;
		font-family: 'Nova Slim', sans-serif;
		box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.25);
		border-radius: 0px 0px 0px 10px;
	}
	.traits {
		border-radius: 0px 0px 10px 0px;
	}
</style>
