<script>
	import WelcomeAnim from '$lib/components/WelcomeAnim.svelte';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import { invoke } from '@tauri-apps/api/core';
	import { onMount } from 'svelte';
	let AnimShow = $state('true');
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
		<Dashboard />
	{/if}
</div>

<style>
	.view {
		background-color: #16181f;
		width: 100%;
		margin: 0;
		padding: 0;
	}
</style>
