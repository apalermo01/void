<template>
  <RouterLink to="/canvas">
    <Palette />
    <span class="text-lg">Canvas</span>
  </RouterLink>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Palette } from 'lucide-vue-next';
</script>
