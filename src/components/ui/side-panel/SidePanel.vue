<script setup>
import Sidebar from "../sidebar/Sidebar.vue";
import SidebarHeader from "../sidebar/SidebarHeader.vue";
import SidebarFooter from "../sidebar/SidebarFooter.vue";
import SidebarMenuButton from "../sidebar/SidebarMenuButton.vue";
import { File, Folder, Keyboard, Settings, Spline } from "lucide-vue-next";
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
import { create_file, create_folder, delete_folder, delete_file, get_folder_content, decide_file_ext } from "@/lib/logic/utils";
import { useExplorerStore } from "@/lib/logic/explorerstore";
import Tooltip from "../tooltip/Tooltip.vue";
import TooltipProvider from "../tooltip/TooltipProvider.vue";
import TooltipContent from "../tooltip/TooltipContent.vue";
import TooltipTrigger from "../tooltip/TooltipTrigger.vue";
import ExplorerMenu from "./side-panel-items/ExplorerMenu.vue";
import { useSidebar } from "../sidebar";
import { watch } from "vue";
import { onKeyDown } from "@vueuse/core";
import router from "@/router";
const plugins = pluginRegistry;
const loadedPlugins = plugins.reduce((acc, name) => {
    acc[name] = defineAsyncComponent(
        () => import(`@/components/ui/side-panel/side-panel-items/${name}.vue`),
    );
    return acc;
}, {});

let dirs = ref([]);
let files = ref([]);
let fcreate = ref(false);
let dcreate = ref(false);
const { state } = useSidebar();
let expanded = ref(false);
let create_type = ref("");
let name = ref("");

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
            console.log(entrie);
            if (entrie.includes('/')) {
                console.log(entrie);
                files.value.push(entrie.split('/')[entrie.split('/').length - 1]);
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

function performCreation(flag) {
    switch (flag) {
        case 'file':
            fcreate.value = true;
            create_type.value = 'file';
            break;

        case 'folder':
            dcreate.value = true;
            create_type.value = 'folder';
            break;
    }
}

onKeyDown('Enter', () => { summon(create_type.value) })

async function summon(flag) {
    console.log("pis: " + flag);
    let store = useExplorerStore();
    let folder = store.current;
    if ((fcreate.value || dcreate.value) && name.value != "") {
        switch (flag) {
            case 'file':
                await create_file('/' + name.value, folder);
                create_type.value = "";
                name.value = "";
                fcreate.value = false;
                await strip_content();
                break;
            case 'folder':
                await create_folder('/' + name.value, folder);
                create_type.value = "";
                name.value = "";
                dcreate.value = false;
                await strip_content();
                break;
        }
    }
}

async function remove_dir(name) {
    let path = useExplorerStore().current;
    await delete_folder('/' + name, path);
    await strip_content();
}

async function remove_file(name) {
    let path = useExplorerStore().current;
    await delete_file('/' + name, path);
    await strip_content();
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
                                <ExplorerMenu @create-file="performCreation('file')"
                                    @create-folder="performCreation('folder')">
                                    <SidebarMenuButton>
                                        <Folder />
                                        <span class="text-lg cursor-pointer"
                                            @click="() => { expanded = !expanded }">Проводник</span>
                                    </SidebarMenuButton>
                                </ExplorerMenu>
                            </CollapsibleTrigger>
                            <CollapsibleContent
                                class="mr-5 data-[state=open]:min-h-[15rem] max-h-[15rem] overflow-y-scroll overflow-x-clip">
                                <SidebarMenuSub v-if="fcreate || dcreate">
                                    <SidebarMenuSubItem>
                                        <span class="text-sm cursor-pointer flex gap-1 items-center">
                                            <input type="text" v-model="name" placeholder="unnamed" />
                                        </span>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                                <ExplorerMenu @create-file="performCreation('file')"
                                    @create-folder="performCreation('folder')"
                                    @delete="async () => await remove_dir(dir)" v-for="dir in dirs">
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <span class="text-sm cursor-pointer flex gap-1 items-center select-none"
                                                @click="async () => { await modify_store(dir) }">
                                                <Folder size="15" />
                                                {{ dir }}
                                            </span>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </ExplorerMenu>
                                <ExplorerMenu @create-file="performCreation('file')"
                                    @create-folder="performCreation('folder')"
                                    @delete="async () => await remove_file(file)" v-for="file in files">
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <span class="text-sm cursor-pointer flex gap-1">
                                                <TooltipRoot>
                                                    <TooltipProvider>
                                                        <TooltipTrigger>
                                                            <span class="truncate block max-w-[10rem]"
                                                                @click="() => { decide_file_ext(file, $router) }">{{
                                                                file }}</span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{{ file }}</TooltipContent>
                                                    </TooltipProvider>
                                                </TooltipRoot>
                                            </span>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </ExplorerMenu>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </CollapsibleRoot>
                </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupLabel class="select-none">Инструменты</SidebarGroupLabel>
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
                    <SidebarMenuButton class="cursor-pointer select-none" asChild>
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
