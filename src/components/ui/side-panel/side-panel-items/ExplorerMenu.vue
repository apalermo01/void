<script setup lang="ts">
import ContextMenu from '../../context-menu/ContextMenu.vue';
import ContextMenuItem from '../../context-menu/ContextMenuItem.vue';
import ContextMenuTrigger from '../../context-menu/ContextMenuTrigger.vue';
import ContextMenuContent from '../../context-menu/ContextMenuContent.vue';
import ContextMenuSeparator from '../../context-menu/ContextMenuSeparator.vue';
let props = defineProps({
  copied: Boolean,
})
</script>
<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem @click="$emit('create-file')">Создать файл</ContextMenuItem>
      <ContextMenuItem @click="$emit('create-folder')">Создать папку</ContextMenuItem>
      <ContextMenuItem @click="$emit('delete')">Удалить файл/папку</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem @click="$emit('rename')">Переименовать</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem @click="$emit('cut')">Вырезать</ContextMenuItem>
      <ContextMenuItem @click="$emit('copy')">Копировать</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem v-if="props.copied" @click="$emit('epaste')">Вставить</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
<style></style>
