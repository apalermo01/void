<script setup lang="ts">
import { Folder } from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>
<template>
    <RouterLink to="#">
        <Folder color="#c4a7e7" fill="#c4a7e7" />
        <span class="text-lg">Проводник</span>
    </RouterLink>
</template>
