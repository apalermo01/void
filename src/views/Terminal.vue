<template>
  <div class="w-full h-full rounded-2xl overflow-hidden ">
    <div ref="terminalContainer" class="w-full h-full rounded-2xl ml-2 mt-0.5"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted } from 'vue';
import { Terminal } from '@xterm/xterm';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { FitAddon } from '@xterm/addon-fit';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { WebglAddon } from '@xterm/addon-webgl';
import { decode } from 'base64-arraybuffer';
import '@xterm/xterm/css/xterm.css';

const terminalContainer = ref<HTMLDivElement | null>(null);
const term = new Terminal({
  fontFamily: 'JetBrains, monospace',
  fontSize: 14,
  allowProposedApi: true,
  allowTransparency: true,
  theme: {
    background: 'var(--destructive)'
  }
});

let resizeObserver: ResizeObserver | null = null;
let auto_fit: FitAddon;
let animationTimeout: NodeJS.Timeout | null = null;
let realtimeRafId: number | null = null;

listen<string>('nvim-data', (event) => {
  const cleanedPayload = decode(event.payload);
  //const bytes = new Uint8Array(cleanedPayload.split('').map(c => c.charCodeAt(0)));
  //const text = new TextDecoder('utf-8').decode(bytes);
  const text = new TextDecoder("utf-8").decode(cleanedPayload);
  term.write(text);
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

function performResize() {
  if (!auto_fit || !terminalContainer.value) return;

  try {
    auto_fit.fit();
    const { rows, cols } = term;
    console.log('Terminal resized:', cols, rows);
    invoke('resize_neovim', { cols, rows });
  } catch (error) {
    console.error('Resize error:', error);
  }
}

function setupTransitionAwareResize() {
  if (!terminalContainer.value) return;

  const container = terminalContainer.value;

  let isAnimating = false;

  const handleTransitionStart = () => {
    isAnimating = true;
    console.log('Animation started');
  };

  const handleTransitionEnd = () => {
    isAnimating = false;
    console.log('Animation ended');
    setTimeout(performResize, 50);
  };

  container.addEventListener('transitionstart', handleTransitionStart);
  container.addEventListener('transitionend', handleTransitionEnd);

  resizeObserver = new ResizeObserver(() => {
    if (!isAnimating) {
      performResize();
    }
  });

  resizeObserver.observe(container);

  return () => {
    container.removeEventListener('transitionstart', handleTransitionStart);
    container.removeEventListener('transitionend', handleTransitionEnd);
  };
}

onMounted(async () => {
  await nextTick();

  auto_fit = new FitAddon();
  const unicode = new Unicode11Addon();
  const webgl = new WebglAddon();

  term.loadAddon(auto_fit);
  term.loadAddon(unicode);
  term.loadAddon(webgl);
  term.unicode.activeVersion = "11";

  if (terminalContainer.value) {
    await waitForContainerSize(terminalContainer.value);
    await new Promise(resolve => setTimeout(resolve, 100));

    if (terminalContainer.value.offsetWidth === 0 || terminalContainer.value.offsetHeight === 0) {
      console.error("Container has invalid dimensions:", terminalContainer.value.offsetWidth, terminalContainer.value.offsetHeight);
      return;
    }

    term.open(terminalContainer.value);
    auto_fit.fit();
    console.log('Initial terminal size:', term.rows, term.cols);

    const { cols, rows } = term;
    invoke('open_neovim', { cols, rows });

    term.onData((data) => {
      invoke('send_to_neovim', { line: data });
    });

    setupTransitionAwareResize();
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  if (animationTimeout) {
    clearTimeout(animationTimeout);
  }

  if (realtimeRafId) {
    cancelAnimationFrame(realtimeRafId);
  }

  term.dispose();
});
</script>

<style scoped>
.term {
  font-family: 'JetBrains', monospace;
  border-radius: 15.5px;
}
</style>
