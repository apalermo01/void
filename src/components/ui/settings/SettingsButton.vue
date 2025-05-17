<script setup lang="ts">
import Button from '../button/Button.vue';
let props = defineProps({
	name: String,
	color: String,
	hover_color: String
})
</script>
<template>
	<Button class="bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)]" type="button">
		{{ props.name }}
	</Button>
</template>
