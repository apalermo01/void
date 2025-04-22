<script setup lang="ts">
import { Terminal } from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>
<template>
    <RouterLink to="/code">
        <Terminal color="#c4a7e7" />
        <span class="text-lg">Neovim</span>
    </RouterLink>
</template>
