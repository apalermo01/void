<script>
	import Settings from '../Settings.svelte';
	let mw = $props();
	let show_component = $state();
</script>

<div
	class="settings-container"
	tabindex="-100000"
	onkeydown={() => console.log('keydown')}
	onclick={() => (show_component = true)}
	aria-label="Настройки"
	role="button"
>
	<img src="settings.png" alt="Settings" class="settings-icon" />
	<h1 style="width: {mw.mw !== '95%' ? '50%' : '0%'}">Настройки</h1>
</div>
{#if show_component}
	<Settings bind:show={show_component} />
{/if}

<style>
	.settings-container {
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

	.settings-icon {
		width: 40px;
		height: 40px;
	}

	.settings-container h1 {
		margin: 0;
		transition: ease-in 0.2s;
		font-weight: 200;
	}
</style>
