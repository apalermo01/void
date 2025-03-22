<script>
	import Settings from './leftside-plugins/settings.svelte';
	let props = $props();
	const plugins = [{ id: 'plugin1', name: 'explorer' }];
	async function loadPlugin(plugname) {
		try {
			const module = await import(`./leftside-plugins/${plugname}.svelte`);
			return module.default;
		} catch (error) {
			console.error(`Failed to load plugin ${plugname}:`, error);
			return null;
		}
	}
</script>

<div class="left-container" style="width: calc(100% - {props.panel_width})">
	<div class="plugins-container">
		{#each plugins as plugin}
			{#await loadPlugin(plugin.name) then Component}
				{#if Component}
					<Component mv={props.panel_width} />
				{/if}
			{/await}
		{/each}
	</div>
	<Settings mw={props.panel_width} />
</div>

<style>
	.left-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: ease-in 0.2s;
		overflow-x: hidden;
		overflow-y: scroll;
		user-select: none;
		-webkit-user-select: none;
	}
	.plugins-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 1em;
	}
</style>
