<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import { onMounted, ref } from "vue";
let username = ref("");
onMounted(async () => {
    username.value = await invoke("get_env", { ename: "NAME" });
});
</script>
<template>
    <h1 class="text-4xl text-rosepine-love text-center pt-[1%]">
        Добро пожаловать, {{ username }}
    </h1>
</template>
