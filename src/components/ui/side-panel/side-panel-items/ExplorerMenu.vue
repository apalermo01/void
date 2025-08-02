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
      <ContextMenuItem @click="$emit('create-file')">{{ $t('contextMenu.createFile') }}</ContextMenuItem>
      <ContextMenuItem @click="$emit('create-folder')">{{ $t('contextMenu.createFolder') }}</ContextMenuItem>
      <ContextMenuItem @click="$emit('delete')">{{ $t('contextMenu.delete') }}</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem @click="$emit('rename')">{{ $t('contextMenu.rename') }}</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem @click="$emit('cut')">{{ $t('contextMenu.cut') }}</ContextMenuItem>
      <ContextMenuItem @click="$emit('copy')">{{ $t('contextMenu.copy') }}</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem v-if="props.copied" @click="$emit('epaste')">{{ $t('contextMenu.epaste') }}</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
<style></style>
