<script>
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
	{#each plugins as plugin}
		{#await loadPlugin(plugin.name) then Component}
			{#if Component}
				<Component mv={props.panel_width} />
			{/if}
		{/await}
	{/each}
</div>

<style>
	.left-container {
		min-height: 94vh;
		transition: ease-in 0.2s;
		overflow-x: hidden;
		overflow-y: scroll;
	}
</style>
