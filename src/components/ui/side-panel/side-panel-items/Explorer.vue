<script setup lang="ts">
import { Folder } from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>
<template>
    <RouterLink to="#">
        <Folder />
        <span class="text-lg">Проводник</span>
    </RouterLink>
</template>
