<script>
	import DashboardNameForm from './DashboardNameForm.svelte';
	export const name = $state('');
	const plugins = $state([
		{ id: 'plugin1', name: 'clock' },
		{ id: 'plugin2', name: 'quote' }
	]);
	async function loadPlugin(plugname) {
		let elem = await import(`./plugins/${plugname}.svelte`);
		return elem.default;
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
				{#await loadPlugin(plugin.name) then loadedPlugin}
					{@render loadPlugin?.(plugin.name)}
				{/await}
			</div>
		{/each}
	</div>
</div>

<style>
</style>
