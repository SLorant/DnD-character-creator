<script>
	import { fade } from 'svelte/transition';
</script>

<head>
	<title>DnD character maker</title>
</head>
<div class="main">
	<img class="logo" src="/logo.svg" alt="" />
	<h2>create your own DnD character easier than before.</h2>
	<div class="boxes">
		<div class="cat">
			<a href="/name">Start creating</a>
			<img src="/elf.jpg" alt="create" />
		</div>
		<div class="cat">
			<a href="/diceroll">Roll the dice!</a>
			<img src="/dice.webp" alt="tools" />
		</div>
	</div>
</div>

<style>
	.main {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		place-items: center;
	}
	.boxes {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		place-items: center;
		gap: 20px;
		margin-bottom: 100px;
	}
	.cat {
		width: 90%;
		height: 150px;
		border-radius: 20px;
		background-color: white;
		font-size: 40px;
		font-weight: bold;
		cursor: pointer;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		place-items: center;
		background-color: transparent;
	}
	img {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 20px;
		object-fit: cover;
		opacity: 0.5;
		mix-blend-mode: multiply;
	}

	.logo {
		z-index: 50;
		position: static;
		mix-blend-mode: normal;
		width: 100%;
		height: 170px;
		margin-top: 0px;
		object-fit: contain;
	}

	h2 {
		font-size: 20px;
		color: white;
		text-align: center;
		width: 80%;
	}
	a {
		width: 100%;
		height: 100%;
	}

	@media (min-width: 600px) {
		.cat {
			width: 600px;
			height: 200px;
		}
		.boxes {
			gap: 40px;
			margin-bottom: 100px;
		}
	}
</style>
