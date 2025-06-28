<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import router from './router/index'
import { RouterView } from 'vue-router';
import Loader from './views/Loader.vue';
import Alert from './components/ui/alert/Alert.vue';
import { listen } from '@tauri-apps/api/event';
import AlertTitle from './components/ui/alert/AlertTitle.vue';
import AlertDescription from './components/ui/alert/AlertDescription.vue';
import { Check, OctagonX } from 'lucide-vue-next';
import { useThemeStore } from './lib/logic/themestore';
import { set_theme } from './lib/logic/settings';
let show_anim = ref(true);
let error = ref('');
let notification = ref('');

listen('error', (event) => {
  error.value = event.payload;
  console.log(error.value)
});

listen('notify', (event) => {
  notification.value = event.payload;
});

listen('themes_downloaded', (event) => {
  notification.value = 'Тема ' + event.payload + ' успешно установлена';
});

onMounted(async () => {
  let firstrun = await invoke('get_env', { ename: 'first_run' });
  let uname = await invoke('get_env', { ename: 'name' });
  let theme = localStorage.getItem('mindbreaker:theme');
  if (theme != 'lotm' && theme != null) {
    await set_theme(theme);
  }
  if (firstrun == "true") {
    router.push('/welcome');
  }
  else if (uname === "") {
    router.push('setup');
  }

  setTimeout(() => { show_anim.value = false }, 1500);

})
</script>
<template>
  <Loader v-if="show_anim" />
  <main v-else>
    <RouterView />
  </main>
  <Alert class="alert" v-if="error != ''" @click="error = ''">
    <OctagonX />
    <AlertTitle>Ошибка!</AlertTitle>
    <AlertDescription>{{ error }}</AlertDescription>
  </Alert>
  <Alert class="notification" v-if="notification != ''" @click="notification = ''">
    <Check />
    <AlertTitle>Уведомление</AlertTitle>
    <AlertDescription>{{ notification }}</AlertDescription>
  </Alert>
</template>
<style>
body {
  background-color: var(--background);
  width: 100%;
  min-height: 100vh;
  overflow-y: hidden;
  font-family: Spectral;
  color: var(--card-foreground)
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.alert {
  z-index: 1000;
  width: 40%;
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: var(--destructive);
  border: 1px solid var(--destructive);
}

.notification {
  z-index: 1000;
  width: 40%;
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: var(--primary);
  border: 1px solid var(--primary);
}
</style>
