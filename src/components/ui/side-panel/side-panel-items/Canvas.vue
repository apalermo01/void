<template>
  <RouterLink to="/canvas">
    <Palette />
        <span class="text-lg">{{ $t('common.canvas') }}</span>
  </RouterLink>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Palette } from 'lucide-vue-next';
</script>
