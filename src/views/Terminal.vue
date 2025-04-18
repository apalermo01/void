<template>
    <div ref="terminalContainer" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Terminal } from '@xterm/xterm'
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core'

const terminalContainer = ref<HTMLDivElement | null>(null)

onMounted(async () => {
    const term = new Terminal()
    if (terminalContainer.value) {
        term.open(terminalContainer.value)
        term.write('🧠 MindBreaker Terminal ready 🚀\r\n')

        await invoke('open_neovim');
        // слушаем сообщения от backend
        listen<string>('terminal-data', (event) => {
            term.write(event.payload + '\r\n')
        })
    }
})
</script>
