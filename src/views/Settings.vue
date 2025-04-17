<script setup lang="ts">
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import CardBody from "@/components/ui/card-3d/CardBody.vue";
import CardItem from "@/components/ui/card-3d/CardItem.vue";
import CardContainer from "@/components/ui/card-3d/CardContainer.vue";
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
        <div
            class="flex w-[65%] px-10 py-10 items-center gap-1.5 settings-field"
        >
            <Input
                class="placeholder:text-rosepine-rose bg-rosepine-overlay border-rosepine-overlay"
                type="text"
                :placeholder="workdir"
                :disabled="true"
            />
            <Button
                class="bg-rosepine-base hover:bg-rosepine-love"
                type="button"
                @click="async () => (workdir = await changeWorkdir())"
            >
                Изменить
            </Button>
        </div>
        <div class="user-3d fixed right-[5%]" v-if="showCard">
            <CardContainer>
                <CardBody
                    class="group/card relative size-auto rounded-xl border border-black/[0.1] bg-rosepine-base p-6 sm:w-[20rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]"
                >
                    <CardItem
                        :translate-z="50"
                        class="text-xl font-bold text-rosepine-love dark:text-white"
                    >
                        {{ uname }}
                    </CardItem>
                    <CardItem
                        as="p"
                        translate-z="60"
                        class="mt-2 max-w-sm text-sm text-rosepine-rose dark:text-neutral-300 text-center"
                    >
                        Раскрой свой потенциал!
                    </CardItem>
                    <CardItem
                        :translate-z="100"
                        :rotate-x="20"
                        :rotate-z="10"
                        class="mt-4 w-full"
                    >
                        <img
                            :src="pic"
                            height="1000"
                            width="1000"
                            class="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
                        />
                    </CardItem>
                    <div class="mt-20 flex items-center justify-between">
                        <CardItem
                            :translate-z="20"
                            class="rounded-xl px-4 py-2 text-lg text-rosepine-love font-normal dark:text-white"
                        >
                            0
                        </CardItem>
                        <CardItem
                            :translate-z="20"
                            class="rounded-xl bg-rosepine-rose px-4 py-2 text-xs font-bold text-rosepine-base dark:bg-white dark:text-black"
                        >
                            The Creator
                        </CardItem>
                    </div>
                </CardBody>
            </CardContainer>
        </div>
    </div>
</template>
<style scoped>
.settings-container {
    overflow-y: scroll;
}
</style>
