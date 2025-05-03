<script setup>
import Sidebar from "../sidebar/Sidebar.vue";
import SidebarHeader from "../sidebar/SidebarHeader.vue";
import SidebarGroup from "../sidebar/SidebarGroup.vue";
import SidebarFooter from "../sidebar/SidebarFooter.vue";
import SidebarMenuButton from "../sidebar/SidebarMenuButton.vue";
import { Folder, Settings } from "lucide-vue-next";
import { Spline } from "lucide-vue-next";
import SidebarMenuItem from "../sidebar/SidebarMenuItem.vue";
import SidebarMenu from "../sidebar/SidebarMenu.vue";
import SidebarGroupContent from "../sidebar/SidebarGroupContent.vue";
import SidebarContent from "../sidebar/SidebarContent.vue";
import SidebarGroupLabel from "../sidebar/SidebarGroupLabel.vue";
import { showSettings } from "@/lib/logic/settings";
import { pluginRegistry } from "@/components/ui/side-panel/side-panel-items/index";
import { defineAsyncComponent } from "vue";
const plugins = pluginRegistry;
const loadedPlugins = plugins.reduce((acc, name) => {
    acc[name] = defineAsyncComponent(
        () => import(`@/components/ui/side-panel/side-panel-items/${name}.vue`),
    );
    return acc;
}, {});
</script>
<template>
    <Sidebar collapsible="icon" variant="floating" class="h-[95vh] mt-10 text-sidebar-primary">
        <SidebarHeader />
        <SidebarContent class="px-2">
            <SidebarGroupLabel>Артефакты</SidebarGroupLabel>
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
