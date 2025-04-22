<script setup lang="ts">
import { Spline } from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>
<template>
    <RouterLink to="#">
        <Spline color="#c4a7e7" fill="#c4a7e7" />
        <span class="text-lg">Граф</span>
    </RouterLink>
</template>
