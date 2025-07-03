<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { install_plugin, get_plugins_list } from '@/lib/logic/extensions';
let installed = ref<any[]>([]);
let notInstalled = ref<any[]>([]);

onMounted(async () => {
  installed.value = await get_plugins_list('not_installed');
  console.log(installed.value);
});
</script>
<template>
  <div class="w-full h-full flex flex-col gap-2 items-center overflow-auto">
    <h1 class="text-4xl text-[var(--destructive)] text-shadow-2xs">Плагины</h1>
    <p>Собери свой void!</p>
  </div>
</template>
