<script setup lang="ts">
import { defineProps } from 'vue';
let props = defineProps({
	value: String,
});
</script>

<template>
	<p class="px-10 text-xs pt-5">{{ props.value }}</p>
</template>
