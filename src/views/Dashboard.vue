<script setup>
import SidePanel from "@/components/ui/side-panel/SidePanel.vue";
import SidebarProvider from "@/components/ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "@/components/ui/sidebar/SidebarTrigger.vue";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
} from "lucide-vue-next";
import { useCookies } from "@vueuse/integrations/useCookies";
import { onMounted, ref } from "vue";
import { checkShowable } from "@/lib/logic/utils";
const showPanel = useCookies(["sidebar:state"]);
let showTrigger = ref(false);
onMounted(() => {
    showTrigger.value = checkShowable();
    window.addEventListener("resize", () => {
        showTrigger.value = checkShowable();
    });
});
</script>
<template>
    <div class="app-container">
        <SidebarProvider :defaultOpen="showPanel.get('sidebar:state')">
            <SidePanel />
            <SidebarTrigger class="sidepanel-trigger top-1" v-if="showTrigger" />
            <div class="fixed right-[1%] top-1 flex gap-1">
                <ChevronLeft color="#c4a7e7" v-if="showTrigger" @click="$router.back()" />
                <ChevronRight color="#c4a7e7" v-if="showTrigger" @click="$router.forward()" />
            </div>
        </SidebarProvider>
        <div class="content-view">
            <Transition name="fade" duration="100" mode="out-in">
                <RouterView />
            </Transition>
        </div>
    </div>
</template>

<style>
.app-container {
    width: 100%;
    display: flex;
}

.sidepanel-trigger {
    z-index: 100;
    position: fixed;
    left: 5%;
}

.content-view {
    margin-top: 3rem;
    margin-right: 1rem;
    width: 1100em;
    height: 93vh;
    border: 1px solid var(--color-rosepine-love);
    border-radius: 15.5px;
    background-color: var(--color-rosepine-surface);
}
</style>
