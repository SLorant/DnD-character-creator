<script lang="ts">
	export let visible: boolean;
</script>

<div class="visible" />

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
</style>
