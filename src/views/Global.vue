<template>
    <h1 class="text-4xl text-center text-accent mt-2">Настройки</h1>
    <SettingsHeader value="изменить рабочую директорию" />
    <SettingsComposition>
        <SettingsField :placeholder="workdir" />
        <SettingsButton @click="async () => (workdir = await changeWorkdir())" name="Изменить" />
    </SettingsComposition>
    <SettingsHeader value="изменить тему" />
    <SettingsComposition>
        <SettingsSelector selectorPlaceholder="Темы" :currentVal="theme" :valList="list_of_themes" v-model="theme" />
        <SettingsButton @click="get_themes_marketplace" name="Скачать темы" />
        <SettingsButton name="Открыть список тем" />
    </SettingsComposition>
    <SettingsPopup v-if="showpopup" :object_list="objects" v-model="showpopup" />

</template>

<script setup lang="ts">
import { Theme, changeWorkdir, getWorkdir, get_installed_themes_list, get_themes_to_download } from "@/lib/logic/settings";
import { onMounted, ref } from "vue";
import { useThemeStore } from "@/lib/logic/themestore";
import SettingsSelector from "../components/ui/settings/SettingsSelector.vue";
import SettingsButton from "@/components/ui/settings/SettingsButton.vue";
import SettingsHeader from "@/components/ui/settings/SettingsHeader.vue";
import SettingsField from "@/components/ui/settings/SettingsField.vue";
import SettingsComposition from "@/components/ui/settings/SettingsComposition.vue";
import SettingsPopup from "@/components/ui/settings/SettingsPopup.vue";
import { listen } from "@tauri-apps/api/event";
let workdir = ref("");
let showpopup = ref(false);
let theme = ref("");
let objects = ref<Theme[]>([]);
let list_of_themes = ref();

function get_themes_marketplace() {
    showpopup.value = !showpopup.value;
    get_themes_to_download().then((res: Theme[]) => { objects.value = res; console.log(res); }, () => { console.warn("faild to fetch themes") });
};

listen("theme_downloaded", async () => {
    let themes_arr = [];
    themes_arr = await get_installed_themes_list();
    themes_arr.push('lotm');
    list_of_themes.value = themes_arr;
})


onMounted(async () => {
    workdir.value = await getWorkdir();
    let theme_store = useThemeStore();
    theme.value = theme_store.current;
    if (theme.value === '') {
        theme.value = 'lotm';
    }
    let themes_arr = [];
    themes_arr = await get_installed_themes_list();
    themes_arr.push('lotm');
    list_of_themes.value = themes_arr;
});

</script>
