<script setup lang="ts">
import { Home } from "lucide-vue-next";
</script>
<template>
    <RouterLink to="/home">
        <Home />
        <span class="text-lg">{{ $t('common.home') }}</span>
    </RouterLink>
</template>
