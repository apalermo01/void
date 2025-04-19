<template>
    <div ref="terminalContainer" class="w-full h-full rounded-2xl overflow-hidden"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import { Terminal } from '@xterm/xterm';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

const terminalContainer = ref<HTMLDivElement | null>(null);
const term = new Terminal({
    fontFamily: 'JetBrains, monospace',
    fontSize: 14,
    convertEol: true,
});

listen<string>('nvim-data', (event) => {
    const cleanedPayload = event.payload.replace(/\r?\n/g, '\r\n');
    term.write(cleanedPayload);
});

function waitForContainerSize(container: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
        const observer = new ResizeObserver(() => {
            if (container.offsetWidth > 0 && container.offsetHeight > 0) {
                observer.disconnect();
                resolve();
            }
        });
        observer.observe(container);
    });
}

onMounted(async () => {
    await nextTick();
    const auto_fit = new FitAddon();
    term.loadAddon(auto_fit);

    if (terminalContainer.value) {
        await waitForContainerSize(terminalContainer.value);
        await new Promise(resolve => setTimeout(resolve, 100)); // Задержка для стабильности

        if (terminalContainer.value.offsetWidth === 0 || terminalContainer.value.offsetHeight === 0) {
            console.error("Container has invalid dimensions:", terminalContainer.value.offsetWidth, terminalContainer.value.offsetHeight);
            return;
        }

        term.open(terminalContainer.value);
        auto_fit.fit();
        console.log(term.rows, term.cols);
        const { cols, rows } = term;
        term.write('🧠 MindBreaker Terminal ready 🚀\r\n');
        invoke('open_neovim', { cols, rows });

        let resizeTimeout: NodeJS.Timeout | null = null;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                auto_fit.fit();
                const { rows, cols } = term;
                console.log(cols, rows);
                invoke('resize_neovim', { cols, rows });
            }, 200);
        });
    }
});
</script>

<style scoped>
.term {
    font-family: 'JetBrains', monospace;
    border-radius: 15.5px;
}
</style>
