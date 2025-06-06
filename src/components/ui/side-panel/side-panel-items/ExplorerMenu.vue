<script setup lang="ts">
import ContextMenu from '../../context-menu/ContextMenu.vue';
import ContextMenuItem from '../../context-menu/ContextMenuItem.vue';
import ContextMenuTrigger from '../../context-menu/ContextMenuTrigger.vue';
import ContextMenuContent from '../../context-menu/ContextMenuContent.vue';
import ContextMenuSeparator from '../../context-menu/ContextMenuSeparator.vue';
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
            <ContextMenuItem>Переименовать</ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
</template>
<style></style>
