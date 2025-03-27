<script>
	import { fade } from 'svelte/transition';
	import { invoke } from '@tauri-apps/api/core';
	import { open } from '@tauri-apps/plugin-dialog';
	import { onMount } from 'svelte';

	let { show = $bindable(), settings = $bindable() } = $props();
	let folder = $state('');
	const settings_list = JSON.parse(settings);

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			show = false;
		}
	}

	async function change_dir(name) {
		let path = await open({
			directory: true
		});
		await invoke('set_env', { ename: name, name: path });
		folder = path;
	}

	onMount(async () => {
		folder = await invoke('get_env', { ename: 'WORKDIR' });
		console.log(folder);
	});
</script>

<div
	class="backdrop"
	tabindex="-100000"
	onkeydown={() => console.log('keydown')}
	onclick={handleBackdropClick}
	aria-label="Settings"
	role="button"
	transition:fade={{ duration: 200 }}
>
	<div class="settings-container">
		<h1>Settings</h1>
		<div class="switcher-panel">
			{#each settings_list.settings as setting}
				{#if setting.type === 'path'}
					<h2>{setting.name}</h2>
					<div class="path-container">
						<div class="property-field">
							{#await invoke('get_env', { ename: setting.env }) then path}
								{folder}
							{/await}
						</div>
						<button class="property-btn" onclick={async () => change_dir(setting.env)}
							>Сменить директорию</button
						>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(
			circle at center,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(22, 24, 31, 0.8) 50%,
			#16181f 70%
		);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.settings-container {
		width: 74%;
		height: 74vh;
		background-color: #191724;
		border-radius: 20px;
	}
	.settings-container h1 {
		color: #e87084;
		font-size: 2em;
		font-weight: 200;
		width: 100%;
		text-align: center;
	}
	.switcher-panel {
		margin: 3%;
		width: 94%;
		height: 80%;
		overflow-y: scroll;
		color: #ababab;
	}

	h2 {
		color: #c4a7e7;
		font-weight: 200;
	}

	.path-container {
		width: 100%;
		display: flex;
	}
	.property-field {
		width: 80%;
		font-size: 1em;
		border: 1px solid #c4a7e7;
		color: #ebbcba;
		padding-left: 2em;
		text-decoration: underline;
		padding-top: 0.5em;
		padding-bottom: 0.5em;
		border-radius: 20px 0px 0px 20px;
		text-overflow: ellipsis;
		overflow: hidden;
		padding-right: 2em;
	}
	.property-btn {
		background-color: #c4a7e7;
		outline: none;
		color: #223a4b;
		font-size: 0.8em;
		font-weight: 600;
		border: none;
		border-radius: 0px 20px 20px 0px;
		width: 20%;
		cursor: pointer;
	}
</style>
