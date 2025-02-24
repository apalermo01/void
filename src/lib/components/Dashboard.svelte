<script>
	import DashboardNameForm from './DashboardNameForm.svelte';
	export const name = $state('');
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
</script>

{#if name === ''}
	<DashboardNameForm />
{/if}
<div class="main-dashboard-container">
	<h1>Добро пожаловать, {name}</h1>
	<div class="plugins-container">
		{#each plugins as plugin}
			<div class="plugin-card">
				<h2>{plugin.name}</h2>
				{#await loadDashboardPlugin(plugin.name) then Component}
					{#if Component}
						<Component />
					{/if}
				{/await}
			</div>
		{/each}
	</div>
</div>
``

<style>
	/* Add your styles here */
</style>
