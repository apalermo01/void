<script>
	let { panel = $bindable('') } = $props();
	function opensidepanel() {
		panel = panel === '98%' ? '80%' : '98%';
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
		top: 0.5em;
		left: 5em;
		height: 5vh;
		background: transparent;
	}
	.topbar-container .menu-button {
		background: url('burger.svg') no-repeat;
		outline: none;
		border: none;
		cursor: pointer;
		width: 50px;
		height: 50px;
	}
</style>
