<script>
	let { panel = $bindable('') } = $props();
	function opensidepanel() {
		if (window.innerWidth > 1600) {
			panel = panel === '98%' ? '90%' : '98%';
		} else if (window.innerWidth < 768) {
			panel = panel;
		} else {
			panel = panel === '96%' ? '80%' : '96%';
		}
	}
</script>

<div class="topbar-container">
	<button aria-label="button" class="menu-button" onclick={opensidepanel}></button>
</div>

<style>
	.topbar-container {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background-color: #16181f;
		width: 100%;
		position: fixed;
		top: -0.5vh;
		margin: 0;
		padding: 0;
		left: 6em;
		height: 5vh;
		background: transparent;
	}
	.topbar-container .menu-button {
		background: url('burger.svg') no-repeat;
		background-size: 100% 100%;
		outline: none;
		border: none;
		cursor: pointer;
		width: 30px;
		height: 30px;
	}
</style>
