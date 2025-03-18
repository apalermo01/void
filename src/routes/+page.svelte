<script>
	import WelcomeAnim from '$lib/components/WelcomeAnim.svelte';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import Topbar from '$lib/components/Topbar.svelte';
	import { invoke } from '@tauri-apps/api/core';
	import { onMount } from 'svelte';
	let AnimShow = $state('true');
	let dashboard_width = $state('98%');
	onMount(() => {
		invoke('get_env', { ename: 'FIRST_RUN' }).then((data) => {
			AnimShow = data;
		});
	});
</script>

<div class="main view">
	{#if AnimShow === 'true'}
		<WelcomeAnim bind:show={AnimShow} />
	{:else}
		<Topbar bind:panel={dashboard_width} />
		<div class="main-dashboard-container">
			<Dashboard bind:width={dashboard_width} />
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
	.main-dashboard-container {
		display: flex;
		width: 99%;
		justify-content: flex-end;
		margin-top: 2%;
		margin-right: 1%;
	}
</style>
