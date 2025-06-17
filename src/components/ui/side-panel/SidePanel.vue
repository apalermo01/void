<script setup>
// Импорт UI компонентов
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
import { create_file, create_folder, delete_folder, delete_file, get_folder_content_paged, decide_file_ext } from "@/lib/logic/utils";
import { useExplorerStore } from "@/lib/logic/explorerstore";
import TooltipProvider from "../tooltip/TooltipProvider.vue";
import TooltipContent from "../tooltip/TooltipContent.vue";
import TooltipTrigger from "../tooltip/TooltipTrigger.vue";
import ExplorerMenu from "./side-panel-items/ExplorerMenu.vue";
import { RecycleScroller } from 'vue-virtual-scroller';
import { useSidebar } from "../sidebar";
import { watch } from "vue";
import { onKeyDown } from "@vueuse/core";
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
const plugins = pluginRegistry;
const loadedPlugins = plugins.reduce((acc, name) => {
  acc[name] = defineAsyncComponent(() => import(`@/components/ui/side-panel/side-panel-items/${name}.vue`));
  return acc;
}, {});

let dirs = ref([]);
let files = ref([]);
let page = ref(0);
let pageSize = 100;
let hasMore = ref(true);
let isLoading = ref(false);
let fcreate = ref(false);
let dcreate = ref(false);
let expanded = ref(false);
let create_type = ref("");
let name = ref("");

const { state } = useSidebar();
const explorer_store = useExplorerStore();
watch(state, (v) => { if (v === 'collapsed') expanded.value = false; });

onMounted(async () => { await resetPagination(); });


async function resetPagination() {
  dirs.value = [];
  files.value = [];
  page.value = 0;
  hasMore.value = true;
  isLoading.value = false;
  await loadNextPage();
}

async function loadNextPage() {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  let entries = await get_folder_content_paged(explorer_store.current, page.value * pageSize, pageSize);
  if (explorer_store.current !== "") dirs.value.push("..");
  entries.forEach(entrie => {
    if (entrie.includes('.') && !entrie.startsWith('.')) files.value.push(entrie.split('/').pop());
    else if (!entrie.startsWith('.') && entrie != '') dirs.value.push(entrie.split('/').pop());
  });
  console.log(files.value);
  files.value = [...files.value];
  if (entries.length < pageSize) hasMore.value = false;
  else page.value++;
  isLoading.value = false;
}

async function modify_store(dir) {
  dir !== '..' ? explorer_store.add_path(dir) : explorer_store.remove_path();
  await resetPagination();
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
  let folder = explorer_store.current;
  if ((fcreate.value || dcreate.value) && name.value != "") {
    switch (flag) {
      case 'file':
        await create_file('/' + name.value, folder);
        create_type.value = "";
        name.value = "";
        fcreate.value = false;
        await resetPagination();
        break;
      case 'folder':
        await create_folder('/' + name.value, folder);
        create_type.value = "";
        name.value = "";
        dcreate.value = false;
        await resetPagination();
        break;
    }
  }
}

async function remove_dir(name) {
  await delete_folder('/' + name, useExplorerStore().current);
  await resetPagination();
}

async function remove_file(name) {
  await delete_file('/' + name, useExplorerStore().current);
  await resetPagination();
}
watch(() => expanded.value, async () => {
  if (expanded.value) {
    await loadNextPage();
  }
  else {
    await resetPagination();
  }
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
                  <span class="text-lg cursor-pointer" @click="expanded = !expanded">Проводник</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <ExplorerMenu>
                <CollapsibleContent v-if="expanded"
                  class="mr-5 data-[state=open]:min-h-[15rem] max-h-[15rem] overflow-y-scroll" @scroll.passive="(e) => {
                    const el = e.target;
                    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) loadNextPage();
                  }">
                  <SidebarMenuSub v-if="fcreate || dcreate">
                    <SidebarMenuSubItem>
                      <span class="text-sm flex gap-1 items-center">
                        <input type="text" v-model="name" placeholder="unnamed" />
                      </span>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                  <RecycleScroller class="scroller" :items="dirs" :item-size="25" :key="explorer_store.current"
                    v-slot="{ item }">
                    <ExplorerMenu @create-file="performCreation('file')" @create-folder="performCreation('folder')"
                      @delete="async () => await remove_dir(item)">
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <span
                            class="text-sm cursor-pointer flex gap-1 items-center select-none truncate block max-w-[10rem]"
                            @click="async () => await modify_store(item)">
                            <Folder size="15" />
                            {{ item }}
                          </span>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </ExplorerMenu>
                  </RecycleScroller>
                  <RecycleScroller class="scroller" :items="files" :item-size="25" v-slot="{ item }">
                    <ExplorerMenu @create-file="performCreation('file')" @create-folder="performCreation('folder')"
                      @delete="async () => await remove_file(item)">
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <span class="text-sm cursor-pointer flex gap-1">
                            <TooltipRoot>
                              <TooltipProvider>
                                <TooltipTrigger>
                                  <span class="truncate block max-w-[10rem]"
                                    @click="() => decide_file_ext(item, $router)">{{ item }}</span>
                                </TooltipTrigger>
                                <TooltipContent>{{ item }}</TooltipContent>
                              </TooltipProvider>
                            </TooltipRoot>
                          </span>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </ExplorerMenu>
                  </RecycleScroller>
                  <div v-if="isLoading" class="text-center py-2 text-sm text-muted">Загрузка...</div>
                </CollapsibleContent>
              </ExplorerMenu>
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
