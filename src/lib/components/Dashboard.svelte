<script>
	import DashboardNameForm from './DashboardNameForm.svelte';
	import { invoke } from '@tauri-apps/api/core';
	import { onMount } from 'svelte';

	let { width = $bindable(''), name = $bindable('unset') } = $props();

	console.log();

	const plugins = $state([
		{ id: 'plugin1', name: 'clock' },
		{ id: 'plugin2', name: 'quote' }
	]);

	async function loadDashboardPlugin(plugname) {
		try {
			const module = await import(`./plugins/${plugname}.svelte`);
			return module.default;
		} catch (error) {
			console.error(`Failed to load plugin ${plugname}:`, error);
			return null;
		}
	}

	onMount(async () => {
		name = await invoke('get_env', { ename: 'NAME' });
	});
</script>

{#if name === ''}
	<DashboardNameForm bind:name />
{:else}
	<div class="main-dashboard-container" style="width: {width}">
		<h1>Добро пожаловать, {name}</h1>
		<h2>Основная панель</h2>
		<div class="plugins-container">
			{#each plugins as plugin}
				{#await loadDashboardPlugin(plugin.name) then Component}
					{#if Component}
						<div class="card">
							<Component />
						</div>
					{/if}
				{/await}
			{/each}
		</div>
	</div>
{/if}

<style>
	.main-dashboard-container {
		color: white;
		font-family: 'Roboto';
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 94vh;
		overflow-y: scroll;
		border-radius: 10px;
		background-color: rgba(20, 20, 20, 1);
		transition: ease-in 0.2s;
	}

	.main-dashboard-container h1 {
		width: 100%;
		text-align: center;
		background: radial-gradient(
			ellipse at bottom,
			rgba(30, 36, 50, 0.7) 10%,
			rgba(20, 20, 20, 0.7) 75%
		);
		border-radius: 50%;
		padding-bottom: 1em;
		background-repeat: no-repeat;
	}
	.main-dashboard-container h2 {
		padding: 0;
		margin: 0;
		width: 40%;
		text-align: center;
		border-bottom: 1px solid gray;
		border-radius: 0px 0px 15px 15px;
	}

	.plugins-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 5%;
		width: 90%;
		flex-wrap: wrap;
	}
	.card {
		padding: 50px;
		width: 1fr;
		border-radius: 15%;
		border: 1px solid #ccc;
	}
	.card:hover {
		box-shadow: 10px 10px 50px gray;
	}
</style>
