<script setup lang="ts">
import { Spline } from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>
<template>
    <RouterLink to="#">
        <Spline />
        <span class="text-lg">{{ $t("common.graph") }}</span>
    </RouterLink>
</template>
