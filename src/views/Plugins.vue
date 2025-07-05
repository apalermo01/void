<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { install_plugin, get_plugins_list } from '@/lib/logic/extensions';
import { Theme, update, get_installed_themes_list, get_themes_to_download, delete_theme, get_themes_marketplace } from "@/lib/logic/settings";
import SettingsSelector from "../components/ui/settings/SettingsSelector.vue";
import SettingsHeader from '@/components/ui/settings/SettingsHeader.vue';
import SettingsButton from '@/components/ui/settings/SettingsButton.vue';
import SettingsComposition from '@/components/ui/settings/SettingsComposition.vue';
import SettingsField from '@/components/ui/settings/SettingsField.vue';
import SettingsPopup from "@/components/ui/settings/SettingsPopup.vue";
import { listen } from '@tauri-apps/api/event';
import { useThemeStore } from '@/lib/logic/themestore';
import SettingsSeparator from '@/components/ui/settings/SettingsSeparator.vue';
let installed = ref<any[]>([]);
let showPopup = ref(false);
let objects = ref<Theme[]>([]);
let listOfThemes = ref();
let theme = ref("");
let notInstalled = ref<any[]>([]);

function getThemesMarketplace() {
  showPopup.value = !showPopup.value;
  get_themes_to_download().then((res: Theme[]) => { objects.value = res; console.log(res); }, () => { console.warn("faild to fetch themes") });
};

listen("theme_downloaded", async () => {
  await updateThemesList();
})

listen("theme_changed", async () => {
  await updateThemesList();
});

async function updateThemesList() {
  let themesArr = [];
  themesArr = await get_installed_themes_list();
  themesArr.push('lotm');
  listOfThemes.value = themesArr;
}

onMounted(async () => {
  installed.value = await get_plugins_list('not_installed');
  console.log(installed.value);
  let themeStore = useThemeStore();
  theme.value = themeStore.current;
  if (theme.value === '' && theme.value != null) {
    theme.value = 'lotm';
  }
  let themesArr = [];
  themesArr = await get_installed_themes_list();
  themesArr.push('lotm');
  listOfThemes.value = themesArr;
});
</script>
<template>
  <div class="w-full h-full flex flex-col gap-2 items-center overflow-auto">
    <h1 class="text-4xl text-[var(--destructive)] text-shadow-2xs">Расширения и кастомизация</h1>
    <p>Собери свой void!</p>
  </div>
  <SettingsHeader value="установить расширения" />
  <SettingsHeader value="изменить тему" />
  <SettingsComposition>
    <h2>Хочется больше свободы?</h2>
    <SettingsButton name="Установить расширения" @click="async () => { getThemesMarketplace() }" />
  </SettingsComposition>
  <SettingsComposition>
    <SettingsSelector selectorPlaceholder="Темы" :currentVal="theme" :valList="listOfThemes" v-model="theme" />
  </SettingsComposition>
  <SettingsHeader value="Установленные темы" />
  <div class="installed-themes-table">
    <SettingsComposition v-for="theme in listOfThemes">
      <SettingsField :placeholder="theme" />
      <SettingsButton v-if="theme != 'lotm'" name="Проверить наличие обновлений"
        @click="async () => { update(theme) }" />
      <SettingsButton v-if="theme != 'lotm'" name="Удалить" @click="async () => { await delete_theme(theme) }" />
    </SettingsComposition>
  </div>
  <SettingsSeparator />
  <SettingsPopup v-if="showPopup" :object_list="objects" v-model="showPopup" />
</template>
<style scoped>
.installed-themes-table {
  margin-top: 1em;
  border: var(--border);
  margin-left: 3em;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>
