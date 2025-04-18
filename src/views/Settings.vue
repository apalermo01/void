<script setup lang="ts">
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import Card from "@/components/ui/profile/Card.vue";
import { changeWorkdir, getUsername, getWorkdir } from "@/lib/logic/settings";
import { onMounted, ref } from "vue";
import { get_file_content, checkShowable } from "@/lib/logic/utils";
let workdir = ref("");
let uname = ref("");
let pic = ref();
let showCard = ref(true);
onMounted(async () => {
    workdir.value = await getWorkdir();
    uname.value = await getUsername();
    let profile_pic = workdir.value + "/profile.png";
    pic.value = await get_file_content(profile_pic, "image/png");
    showCard.value = checkShowable();
    window.addEventListener("resize", () => {
        showCard.value = checkShowable();
    });
});
</script>
<template>
    <div class="settings-container">
        <h1 class="text-4xl text-center text-rosepine-love mt-2">Настройки</h1>
        <div class="flex w-[65%] px-10 py-10 items-center gap-1.5 settings-field">
            <Input class="placeholder:text-rosepine-rose bg-rosepine-overlay border-rosepine-overlay" type="text"
                :placeholder="workdir" :disabled="true" />
            <Button class="bg-rosepine-base hover:bg-rosepine-love" type="button"
                @click="async () => (workdir = await changeWorkdir())">
                Изменить
            </Button>
        </div>
        <div class="user-3d fixed right-[5%]" v-if="showCard">
            <Card :uname="uname" :pic="pic" />
        </div>
    </div>
</template>
<style scoped>
.settings-container {
    overflow-y: scroll;
}
</style>
