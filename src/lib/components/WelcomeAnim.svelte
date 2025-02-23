<script>
	import { slide } from 'svelte/transition';
	let welcome_info = [
		'Добро пожаловать в mindbreaker, путник!',
		'Это мое новое творение которое я создал как сайд-проект.',
		'Основная суть - создать второй мозг который не будет так сложен в настройке как obsidian или notion.',
		'Но главное - оставить все такую же гибкость настройки и использования!',
		'Надеюсь тебе понравится!'
	];
	let current_info = $state(0);

	function lessgo() {}
</script>

<div class="animation-block">
	{#key current_info}
		<h1 transition:slide={{ duration: 1000 }}>{welcome_info[current_info]}</h1>
	{/key}

	<div class="buttons">
		<button
			id="left"
			aria-label="prev"
			onclick={() => (current_info == 0 ? current_info : current_info--)}
		></button>
		{#if current_info == welcome_info.length - 1}
			<button id="lessgo" onclick={lessgo}>Хочу попробовать!</button>
		{/if}
		<button
			id="right"
			aria-label="next"
			onclick={() => (current_info == welcome_info.length - 1 ? current_info : current_info++)}
		></button>
	</div>
</div>

<style>
	.animation-block {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		width: 80%;
		margin: 0 auto;
	}
	h1 {
		color: white;
		font-size: 2rem;
		text-align: center;
	}
	.buttons {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	button {
		min-width: 50px;
		min-height: 50px;
		background-color: #16181f;
		color: white;
		cursor: pointer;
		border: none;
	}

	#left {
		background-image: url('leftarr.svg');
		background-size: cover;
	}
	#right {
		background-image: url('rightarr.svg');
		background-size: cover;
	}

	#lessgo {
		background-color: white;
		color: black;
		padding: 0 3em;
		font-size: 1em;
		border-radius: 10px;
		margin: 10px;
	}
</style>
