<script>
	import Settings from './leftside-plugins/settings.svelte';
	import { fly } from 'svelte/transition';
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
					<Component />
				{/if}
			{/await}
		{/each}
	</div>
	<Settings />
</div>

<style>
	.left-container {
		min-width: 50px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: width 0.2s ease-in-out;
		overflow-y: scroll;
		overflow-x: hidden;
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
