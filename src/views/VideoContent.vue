<template>
  <div class="w-full h-full overflow-hidden rounded-[15.5px]">
    <div class="video-player select-none relative">
      <div v-if="error"
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white z-50">
        <div class="text-center">
          <p class="text-lg mb-2">Ошибка загрузки видео</p>
          <p class="text-sm">{{ error }}</p>
        </div>
      </div>
      <div :key="videoKey" class="video-container">
        <video ref="videoPlayer" class="plyr-react plyr" playsinline @error="handleVideoError">
          <source :src="videoSrc" :type="mimeType">
        </video>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const props = defineProps<{
  url?: string;
}>();

const videoPlayer = ref<HTMLVideoElement | null>(null);
const error = ref<string>('');
const videoKey = ref<number>(0);
let player: Plyr | null = null;

const options = {
  controls: [
    'play-large',
    'play',
    'progress',
    'current-time',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'fullscreen'
  ],
  settings: ['captions', 'quality', 'speed'],
  quality: {
    default: 720,
    options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
  },
  speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] }
};

const filePath = computed(() => props.url ? decodeURIComponent(atob(props.url)) : '');

const mimeType = computed(() => {
  const ext = filePath.value.split('.').pop()?.toLowerCase();
  return {
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo'
  }[ext || ''] || 'video/mp4';
});

const videoSrc = computed(() => {
  if (!filePath.value) return '';
  return `http://localhost:1421/video?path=${encodeURIComponent(filePath.value)}`;
});

const handleVideoError = (event: Event) => {
  error.value = `Ошибка видео: ${(event.target as HTMLVideoElement).error?.message || 'Неизвестная ошибка'}`;
};

const checkFileExists = async () => {
  if (!filePath.value) return;

  try {
    const exists = await invoke<boolean>('check_file_exists', { path: filePath.value });
    if (!exists) error.value = 'Файл не найден';
  } catch (err) {
    error.value = `Ошибка проверки файла: ${err}`;
  }
};

const destroyPlayer = () => {
  player?.destroy();
  player = null;
};

const initPlayer = async () => {
  destroyPlayer();
  videoKey.value++;
  await nextTick();

  if (videoPlayer.value) {
    player = new Plyr(videoPlayer.value, options);
  }
};

watch(() => props.url, async () => {
  await checkFileExists();
  await initPlayer();
});

onMounted(async () => {
  await checkFileExists();
  await initPlayer();
});

onUnmounted(destroyPlayer);
</script>

<style scoped>
.video-player {
  width: 100%;
  height: 100%;
  background-color: #000;
}

.video-container {
  width: 100%;
  height: 100%;
}

:deep(.plyr) {
  height: 100%;
  width: 100%;
}

:deep(.plyr__video-wrapper),
:deep(.plyr__video) {
  height: 100%;
  width: 100%;
  object-fit: contain;
}
</style>
