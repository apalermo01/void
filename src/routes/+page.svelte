<script>
	import WelcomeAnim from '$lib/components/WelcomeAnim.svelte';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import Topbar from '$lib/components/Topbar.svelte';
	import Leftbar from '$lib/components/Leftbar.svelte';
	import { invoke } from '@tauri-apps/api/core';
	import { onMount } from 'svelte';
	let AnimShow = $state('true');
	let name = $state('');
	let dashboard_width = $state('');
	onMount(() => {
		invoke('get_env', { ename: 'FIRST_RUN' }).then((data) => {
			AnimShow = data;
		});

		const updateWidth = () => {
			dashboard_width = window.innerWidth > 1700 ? '98%' : '96%';
		};
		updateWidth(); // Установить начальное значение
		window.addEventListener('resize', updateWidth);
		return () => window.removeEventListener('resize', updateWidth);
	});
</script>

<div class="main view">
	{#if AnimShow === 'true'}
		<WelcomeAnim bind:show={AnimShow} />
	{:else}
		<Topbar bind:panel={dashboard_width} />
		<div class="dashboard-container">
			{#if name !== ''}
				<Leftbar panel_width={dashboard_width} />
			{/if}
			<Dashboard bind:width={dashboard_width} bind:name />
		</div>
	{/if}
</div>

<style>
	.view {
		background-color: rgba(20, 20, 20, 0);
		width: 100%;
		min-height: 90vh;
		margin: 0;
		padding: 0;
	}
	.dashboard-container {
		display: flex;
		width: 99%;
		justify-content: flex-end;
		margin-top: 4vh;
		margin-right: 1%;
	}
</style>
