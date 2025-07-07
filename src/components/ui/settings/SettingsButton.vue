<script setup lang="ts">
import Button from '../button/Button.vue';
let props = defineProps({
  name: String,
  class: String,
});
</script>
<template>
  <Button :class="'bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] ' + props.class" type="button">
    {{ props.name }}
  </Button>
</template>
