<script>
	let mw = $props();
</script>

<div class="explorer-container">
	<img src="explorer.svg" alt="Explorer" class="explorer-icon" />
	<h1 style="width: {mw.mw !== '95%' ? '50%' : '0%'}">Проводник</h1>
</div>

<style>
	.explorer-container {
		max-width: 100%;
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
		height: 40px;
	}

	.explorer-container h1 {
		margin: 0;
		transition: ease-in 0.2s;
		font-weight: 200;
	}
</style>
