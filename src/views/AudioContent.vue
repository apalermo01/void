<template>
  <audio :src="sound" controls></audio>
</template>
<script setup lang="ts">
import { get_file_content } from '@/lib/logic/utils';
import { onMounted, ref } from 'vue';

let props = defineProps({
  url: String,
});

let sound = ref('');
onMounted(async () => {
  if (!props.url) { return };
  let audio_path = decodeURIComponent(atob(props.url));
  sound.value = await get_file_content(audio_path);
});
</script>
<style></style>
