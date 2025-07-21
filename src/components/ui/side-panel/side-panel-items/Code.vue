<script setup lang="ts">
import { Terminal } from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>
<template>
  <RouterLink to="/code">
    <Terminal />
    <span class="text-lg">Terminal</span>
  </RouterLink>
</template>
