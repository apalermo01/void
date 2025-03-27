<script>
	import { invoke } from '@tauri-apps/api/core';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let { show = $bindable(true) } = $props();
	let folders = $state();
	let files = $state();
	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			show = false;
		}
	}

	onMount(async () => {
		folders = await invoke('get_entry_list', { flag: 'dir' });
		let infolders = folders.split('\n');
		let names = [];
		Array.from(infolders).forEach((path) => {
			path = path.split('/');
			names.push(path[path.length - 1]);
		});
		folders = names;
		files = await invoke('get_entry_list', { flag: 'file' });
	});
</script>

<div
	class="backdrop-container"
	onclick={handleBackdropClick}
	aria-label="Проводник"
	role="button"
	tabindex="-10000"
	onkeydown={(e) => {
		console.log(e.key);
		if (e.key == 'Escape') {
			show = false;
		}
	}}
	transition:fade
>
	<div class="explorer-container">
		{#each folders as folder}
			<div class="folder">
				<img src="folder.png" alt="folder" />
				{folder}
			</div>
		{/each}
	</div>
</div>

<style>
	.backdrop-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.explorer-container {
		margin: 10%;
		background-color: #1f1d2e;
		padding: 5%;
		width: 60%;
		height: 60vh;
		border: 1px solid #eb6f92;
		border-radius: 20px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9em, 10em));
		gap: 1em;
		overflow-y: scroll;
		overflow-x: hidden;
		justify-content: center;
	}
	.folder {
		height: 30%;
		display: flex;
		flex-direction: column;
		color: #e0def4;
		align-items: center;
	}
	.folder,
	img {
		width: 90%;
	}
</style>
