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
import { CollapsibleContent } from "reka-ui";
import { CollapsibleRoot } from "reka-ui";
import { CollapsibleTrigger } from "reka-ui";
import SidebarMenuSubItem from "../sidebar/SidebarMenuSubItem.vue";
import SidebarMenuSub from "../sidebar/SidebarMenuSub.vue";
import { get_folder_content } from "@/lib/logic/utils";
const plugins = pluginRegistry;
const loadedPlugins = plugins.reduce((acc, name) => {
    acc[name] = defineAsyncComponent(
        () => import(`@/components/ui/side-panel/side-panel-items/${name}.vue`),
    );
    return acc;
}, {});

let dirs = ref([]);
let files = ref([]);

onMounted(async () => {
    let entries = await get_folder_content("");
    entries.forEach((entrie) => {
        if (entrie.includes('.') && !entrie.startsWith('.')) {
            files.value.push(entrie);
        }
        else if (!entrie.startsWith('.')) {
            dirs.value.push(entrie);
        }
        files.value.sort();
        dirs.value.sort();
    })
})
</script>
<template>
    <Sidebar collapsible="icon" variant="floating" class="h-[95vh] mt-10 text-sidebar-primary">
        <SidebarHeader />
        <SidebarContent class="px-2">
            <SidebarGroupContent>
                <SidebarMenu>
                    <CollapsibleRoot :default-open="false" class="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <Folder />
                                    <span class="text-lg cursor-pointer">Проводник</span>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent class="mr-5 overflow-hidden">
                                <SidebarMenuSub v-for="dir in dirs">
                                    <SidebarMenuSubItem>
                                        <span class="text-sm cursor-pointer flex gap-1 items-center">
                                            <Folder size="15" />
                                            {{ dir }}
                                        </span>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                                <SidebarMenuSub v-for="file in files">
                                    <SidebarMenuSubItem>
                                        <span class="text-sm cursor-pointer flex gap-1">
                                            {{ file }}
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
