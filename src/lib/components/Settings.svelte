<script>
	import { fade } from 'svelte/transition';
	let { show = $bindable() } = $props();
	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			show = false;
		}
	}
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
		<div class="switcher-panel"></div>
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
		background-color: #3a3b3b;
		border-radius: 20px;
	}
	.settings-container h1 {
		color: #ababab;
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
	}
</style>
