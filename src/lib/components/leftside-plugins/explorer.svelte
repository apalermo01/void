<script>
	import Explorer from '../Explorer.svelte';
	let show = $state(false);
	function openExplorer() {
		show = true;
	}
</script>

<div
	class="explorer-container"
	onclick={openExplorer}
	aria-label="Проводник"
	role="button"
	tabindex="-10000"
	onkeydown={(e) => {
		console.log(e.key);
		if (e.key == 'Escape') {
			show = false;
		}
	}}
>
	<img src="explorer.svg" alt="Explorer" class="explorer-icon" />
	<h1>Проводник</h1>
</div>
{#if show}
	<Explorer bind:show />
{/if}

<style>
	.explorer-container {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		color: #ababab;
		font-size: 0.7em;
		align-items: center;
		gap: 1em;
		padding: 0.7em;
		cursor: pointer;
	}

	.explorer-icon {
		width: 40px;
	}

	.explorer-container h1 {
		margin: 0;
		transition: ease-in 0.2s;
		font-weight: 200;
	}
</style>
