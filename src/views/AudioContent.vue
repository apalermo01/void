<template>
  <div class="audio-player select-none">
    <img :src="meta_image" />
    <audio ref="Player" :src="sound"></audio>
    <div class="controls">
      <PlayCircle @click="togglePlay()" v-if="!now_playing" class="w-[3em] h-[3em]" />
      <PauseCircle @click="togglePlay()" v-else class="w-[3em] h-[3em]" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { get_audio_content, get_file_content } from '@/lib/logic/utils';
import { PlayCircle, PauseCircle } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
let props = defineProps({
  url: String,
});

let meta_image = ref<string>('');
let sound = ref<string>('');
let Player = ref<HTMLAudioElement | null>(null);
let now_playing = ref<boolean>(false);
function togglePlay() {
  now_playing.value = !now_playing.value;
  if (now_playing.value) {
    Player.value?.play();
  }
  else {
    Player.value?.pause();
  }
}
onMounted(async () => {
  if (!props.url) { return };
  let audio_path = decodeURIComponent(atob(props.url));
  sound.value = await get_file_content(audio_path);
  meta_image.value = await get_audio_content(audio_path);
});
</script>
<style scoped>
.audio-player {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>
