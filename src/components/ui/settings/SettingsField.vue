<script setup lang="ts">
import Input from '../input/Input.vue';
import { defineProps } from 'vue';
let props = defineProps({
	placeholder: String
})
</script>
<template>
	<Input class="placeholder:text-[var(--card-nested-foreground)] bg-[var(--card-nested)]" type="text"
		:placeholder="props.placeholder" :disabled="true" />
</template>
