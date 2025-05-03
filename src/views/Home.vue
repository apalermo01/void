<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import { onMounted, ref } from "vue";
let username = ref("");
onMounted(async () => {
    username.value = await invoke("get_env", { ename: "name" });
    console.log(username.value);
});
</script>
<template>
    <h1 class="text-4xl text-accent text-center pt-[1%]">
        Добро пожаловать, {{ username }}
    </h1>
</template>
<style scoped>
h1 {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}
</style>
