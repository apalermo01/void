<script setup>
import { changeWorkdir, getUsername, getWorkdir, get_themes_marketplace } from "@/lib/logic/settings";
import { onMounted, ref } from "vue";
import { get_file_content, checkShowable } from "@/lib/logic/utils";
import { useThemeStore } from "@/lib/logic/themestore";
import SettingsButton from "@/components/ui/settings/SettingsButton.vue";
import SettingsHeader from "@/components/ui/settings/SettingsHeader.vue";
import SettingsField from "@/components/ui/settings/SettingsField.vue";
import SettingsComposition from "@/components/ui/settings/SettingsComposition.vue";
let workdir = ref("");
let theme = ref("");


onMounted(async () => {
    workdir.value = await getWorkdir();
    let theme_store = useThemeStore();
    theme.value = theme_store.current;
    window.addEventListener("resize", () => {
        showCard.value = checkShowable();
    });
});
</script>

<template>
    <h1 class="text-4xl text-center text-accent mt-2">Настройки</h1>
    <SettingsHeader value="изменить рабочую директорию" />
    <SettingsComposition>
        <SettingsField :placeholder="workdir" />
        <SettingsButton @click="async () => (workdir = await changeWorkdir())" />
    </SettingsComposition>
    <SettingsHeader value="изменить тему" />
    <SettingsComposition>
        <SettingsField :placeholder="theme" />
        <SettingsButton @click="async () => (await get_themes_marketplace())" />
    </SettingsComposition>
    <div class="user-3d fixed right-[5%] top-[20%]" v-if="showCard">
        <Card :uname="uname" :pic="pic" />
    </div>
    <div class="fixed right-[5%] top-[15%] w-[25%]">
        <SettingsSelector />
    </div>
</template>
