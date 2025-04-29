<template>
    <RouterLink to="/canvas">
        <Palette color="#c4a7e7" />
        <span class="text-lg">Canvas</span>
    </RouterLink>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Palette } from 'lucide-vue-next';
</script>
