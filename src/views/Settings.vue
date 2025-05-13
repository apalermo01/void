<script setup lang="ts">
import Card from "@/components/ui/profile/Card.vue";
import Global from "./Global.vue";
import SettingsSelector from "./SettingsSelector.vue";
import { onMounted, ref, watch } from "vue";
import type { Component } from "vue";
import { getUsername, getWorkdir } from "@/lib/logic/settings";
import { checkShowable, get_file_content } from "@/lib/logic/utils";
let uname = ref("");
let pic = ref();
let showCard = ref(true);
let workdir = ref("");
let settings_type = ref('');
let settingsComponent = ref<Component | null>(null);
watch(settings_type, async () => {
    settingsComponent.value = await get_settings(settings_type.value);
})

window.addEventListener('resize', () => {
    showCard.value = checkShowable();
})

async function get_settings(stype: string): Promise<Component> {
    console.log(stype);
    let component = await import(`./${stype}.vue`)
    return component.default;
}

onMounted(async () => {
    uname.value = await getUsername();
    workdir.value = await getWorkdir();
    showCard.value = checkShowable();
    let profile_pic = workdir.value + "/profile.png";
    pic.value = await get_file_content(profile_pic, "image/png");
});

</script>
<template>
    <div class="settings-container">
        <Global v-if="settings_type == '' || settings_type == 'Global'" />
        <component v-else :is="settingsComponent"></component>
        <div class=" user-3d fixed right-[5%] top-[20%]" v-if="showCard">
            <Card :uname="uname" :pic="pic" />
        </div>
        <div class="fixed right-[5%] top-[15%] w-[25%]">
            <SettingsSelector v-model="settings_type" />
        </div>
    </div>
</template>
<style scoped>
h1 {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.settings-container {
    overflow-y: scroll;
}
</style>
