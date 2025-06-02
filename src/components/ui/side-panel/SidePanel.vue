<script setup>
import Sidebar from "../sidebar/Sidebar.vue";
import SidebarHeader from "../sidebar/SidebarHeader.vue";
import SidebarFooter from "../sidebar/SidebarFooter.vue";
import SidebarMenuButton from "../sidebar/SidebarMenuButton.vue";
import { File, Folder, Settings, Spline } from "lucide-vue-next";
import SidebarMenuItem from "../sidebar/SidebarMenuItem.vue";
import SidebarMenu from "../sidebar/SidebarMenu.vue";
import SidebarGroupContent from "../sidebar/SidebarGroupContent.vue";
import SidebarContent from "../sidebar/SidebarContent.vue";
import SidebarGroupLabel from "../sidebar/SidebarGroupLabel.vue";
import { showSettings } from "@/lib/logic/settings";
import { pluginRegistry } from "@/components/ui/side-panel/side-panel-items/index";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { CollapsibleContent, TooltipRoot } from "reka-ui";
import { CollapsibleRoot } from "reka-ui";
import { CollapsibleTrigger } from "reka-ui";
import SidebarMenuSubItem from "../sidebar/SidebarMenuSubItem.vue";
import SidebarMenuSub from "../sidebar/SidebarMenuSub.vue";
import { get_folder_content } from "@/lib/logic/utils";
import { useExplorerStore } from "@/lib/logic/explorerstore";
import Tooltip from "../tooltip/Tooltip.vue";
import TooltipProvider from "../tooltip/TooltipProvider.vue";
import TooltipContent from "../tooltip/TooltipContent.vue";
import TooltipTrigger from "../tooltip/TooltipTrigger.vue";
import { useSidebar } from "../sidebar";
import { watch } from "vue";
const plugins = pluginRegistry;
const loadedPlugins = plugins.reduce((acc, name) => {
    acc[name] = defineAsyncComponent(
        () => import(`@/components/ui/side-panel/side-panel-items/${name}.vue`),
    );
    return acc;
}, {});

let dirs = ref([]);
let files = ref([]);
const { state } = useSidebar();
let expanded = ref(false);

watch(state, (v) => {
    if (v === 'collapsed') {
        expanded.value = false;
    }
})

async function modify_store(dir) {
    let explorer_store = useExplorerStore();
    if (dir != '..') {
        explorer_store.add_path(dir);
    }
    else {
        explorer_store.remove_path();
    }
    await strip_content();
}

async function strip_content() {
    dirs.value = [];
    files.value = [];
    let explorer_store = useExplorerStore();
    let entries = await get_folder_content(explorer_store.current);
    if (explorer_store.current != "") {
        dirs.value.push('..');
    }
    entries.forEach((entrie) => {
        if (entrie.includes('.') && !entrie.startsWith('.')) {
            if (entrie.includes('/')) {
                files.value.push(entrie.split('/')[entrie.split('/').length]);
            }
            else {
                files.value.push(entrie);
            }
        }
        else if (!entrie.startsWith('.')) {
            if (entrie.includes('/')) {
                dirs.value.push(entrie.split('/')[entrie.split('/').length - 1]);
            }
            else {
                dirs.value.push(entrie);
            }
        }
        files.value.sort();
        dirs.value.sort();
    })
}

onMounted(async () => {
    await strip_content();
})
</script>
<template>
    <Sidebar collapsible="icon" variant="floating" class="h-[95vh] mt-10 text-sidebar-primary">
        <SidebarHeader />
        <SidebarContent class="px-2">
            <SidebarGroupContent>
                <SidebarMenu>
                    <CollapsibleRoot :default-open="false" v-bind:open="expanded" class="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <Folder />
                                    <span class="text-lg cursor-pointer"
                                        @click="() => { expanded = !expanded }">Проводник</span>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent
                                class="mr-5 data-[state=open]:min-h-[15rem] max-h-[15rem] overflow-y-scroll overflow-x-clip">
                                <SidebarMenuSub v-for="dir in dirs">
                                    <SidebarMenuSubItem>
                                        <span class="text-sm cursor-pointer flex gap-1 items-center select-none"
                                            @click="async () => { await modify_store(dir) }">
                                            <Folder size="15" />
                                            {{ dir }}
                                        </span>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                                <SidebarMenuSub v-for="file in files">
                                    <SidebarMenuSubItem>
                                        <span class="text-sm cursor-pointer flex gap-1">
                                            <TooltipRoot>
                                                <TooltipProvider>
                                                    <TooltipTrigger>
                                                        <span class="truncate block max-w-[10rem]">{{ file }}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{{ file }}</TooltipContent>
                                                </TooltipProvider>
                                            </TooltipRoot>
                                        </span>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </CollapsibleRoot>
                </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupLabel>Инструменты</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu v-for="plugin in plugins" :key="plugin">
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <component :is="loadedPlugins[plugin]" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <a @click="showSettings($router)">
                            <Settings />
                            <span class="text-lg">Настройки</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
</template>
