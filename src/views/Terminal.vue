<template>
    <div ref="terminalContainer" class="w-full h-full rounded-2xl overflow-hidden flex flex-col"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue';
import { Terminal } from '@xterm/xterm';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { FitAddon } from '@xterm/addon-fit';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { WebglAddon } from '@xterm/addon-webgl';
import '@xterm/xterm/css/xterm.css';

const terminalContainer = ref<HTMLDivElement | null>(null);
const term = new Terminal({
    fontFamily: 'JetBrains, monospace',
    fontSize: 14,
    allowProposedApi: true,
    theme: {
        background: '#232137',
    },
    scrollback: 1000,
    convertEol: true,
    cursorBlink: true,
    cursorStyle: 'block',
    allowTransparency: true
});

let resizeObserver: ResizeObserver | null = null;
let resizeTimeout: NodeJS.Timeout | null = null;
let fitAddon: FitAddon | null = null;

function fitTerminal() {
    if (!terminalContainer.value) return;
    if (!fitAddon) {
        fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
    }
    fitAddon.fit();
    const { cols, rows } = term;
    invoke('resize_neovim', { cols, rows });
}

function handleResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(fitTerminal, 50); // Уменьшаем задержку до 50мс
}

listen<string>('nvim-data', (event) => {
    const cleanedPayload = atob(event.payload);
    const bytes = new Uint8Array(cleanedPayload.split('').map(c => c.charCodeAt(0)));
    const text = new TextDecoder('utf-8').decode(bytes);
    term.write(text);
});

onMounted(async () => {
    await nextTick();
    
    if (!terminalContainer.value) return;

    const unicode = new Unicode11Addon();
    const webgl = new WebglAddon();
    
    term.loadAddon(unicode);
    term.loadAddon(webgl);
    term.unicode.activeVersion = "11";

    term.open(terminalContainer.value);
    
    // Настраиваем ResizeObserver для отслеживания изменений размера контейнера
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(terminalContainer.value);
    
    // Начальная подгонка размера
    fitTerminal();
    
    const nvim_path = await invoke("get_env", { ename: "nvim_path" });
    invoke('open_neovim', { 
        cols: term.cols, 
        rows: term.rows, 
        path: nvim_path 
    });

    term.onData((data) => {
        invoke('send_to_neovim', { line: data });
    });

    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    window.removeEventListener('resize', handleResize);
    term.dispose();
});
</script>

<style scoped>
.term {
    font-family: 'JetBrains', monospace;
    border-radius: 15.5px;
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>
