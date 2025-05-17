<script setup lang="ts">
import { defineProps } from 'vue';
import { closePopup } from '@/lib/logic/settings';
import Button from '../button/Button.vue';
import { invoke } from '@tauri-apps/api/core';
let props = defineProps<{
	object_list: any[],
}>();
let show = defineModel();

function download(key: string) {
	invoke('clone_theme', { key: key }).then(() => { console.log("Ok") }, (err) => { console.warn(err) });
}

</script>
<template>
	<div class="marketplace-backdrop" @click="(event) => (show = closePopup(event))">
		<div class="popup-marketplace">
			<div class="card" v-for="object in props.object_list">
				<h1 class="text-xl text-accent ">{{ object.theme_name }}</h1>
				<img class="w-[80%] h-[40%] border-card-border" src="https://shadow.png">
				<p class="text-xs">{{ object.theme_author }}</p>
				<Button class="w-[80%]" @click="download(object.theme_name)">Скачать</Button>
				<p>{{ object.theme_link }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.marketplace-backdrop {
	width: 100%;
	height: 100vh;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
	background: radial-gradient(circle at center, rgba(255, 255, 255, 1), 10%, rgba(0, 0, 0, 0.8));
}

.popup-marketplace {
	width: 80%;
	height: 80vh;
	background: var(--card);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
	grid-auto-rows: 22em;
	gap: 1rem;
	overflow-y: scroll;
}

.card {
	margin: 1rem;
	width: 18em;
	height: 22em;
	background-color: var(--card-nested);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
}

h1 {
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);

}
</style>
