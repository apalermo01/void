<script>
	import { onMount } from 'svelte';

	let time = new Date().toLocaleTimeString();

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date().toLocaleTimeString();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="card">
	<p>{time}</p>
</div>

<style>
	p {
		color: #e0def4;
		font-size: 3em;
	}
</style>
