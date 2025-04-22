<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import router from './router/index'
import { RouterView } from 'vue-router';

onMounted(async () => {
  let firstrun = await invoke('get_env', { ename: 'FIRST_RUN' });
  let uname = await invoke('get_env', { ename: 'NAME' });
  if (firstrun == "true") {
    router.push('/welcome');
  }
  else if (uname === "") {
    router.push('setup');
  }

})
</script>
<template>
  <main>
    <RouterView />
  </main>
</template>
<style>
body {
  background-color: #191724;
  width: 100%;
  min-height: 100vh;
  overflow-y: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
