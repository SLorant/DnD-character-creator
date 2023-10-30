<script lang="ts">
	let showdesc = false;
	import IntroText from './IntroText.svelte';
	import { fly } from 'svelte/transition';
	import Traits from './Traits.svelte';
	export let visible: boolean;
	export let currentRace: string[];
</script>

<div class="visible" transition:fly={{ y: 200, duration: 200 }}>
	<h1>{currentRace[0]}</h1>
	<button
		class="exit"
		on:click={() => {
			visible = false;
		}}>X</button
	>
	<div class="detailtop">
		<div class="detailchoose">
			<button
				class="chooserbutton"
				on:click={() => {
					showdesc = true;
				}}>Description</button
			>
			<button
				class="chooserbutton"
				on:click={() => {
					showdesc = false;
				}}>Traits</button
			>
		</div>
		<img class="descimg" src={currentRace[1]} alt="" />
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

		z-index: 40;
		background: linear-gradient(180deg, #d0d0e4 0%, #688b9e 100%);
	}
	h1 {
		color: #14182d;
		width: 60%;
	}
	.descimg {
		width: 180px;
		height: 250px;
		position: absolute;
		top: 0;
		right: 0;
		opacity: 1;
		object-fit: cover;
		border-radius: 0px 0px 0px 10px;
		mix-blend-mode: multiply;
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
	.detailtop {
		display: flex;
	}
	.detailchoose {
		display: flex;
		flex-direction: column;
		gap: 25px;
		width: 60%;
		justify-content: center;
		place-items: center;
	}
	.detailintro {
		color: #14182d;
		margin: 20px 30px;
	}
	.chooserbutton {
		border: none;
		width: 150px;
		height: 50px;
		background-color: #6a6a83;
		color: #cdf8fb;
		font-size: 25px;
		font-family: 'Nova Slim', sans-serif;
		border-radius: 3px;
	}
</style>
