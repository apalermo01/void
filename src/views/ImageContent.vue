<script setup lang="ts">
import { get_file_content } from '@/lib/logic/utils';
import { onMounted, ref, watch } from 'vue';
let props = defineProps({
  url: String
});

let file = ref('');

onMounted(async () => {
  if (!props.url) { return }
  let file_path = decodeURIComponent(atob(props.url));
  file.value = await get_file_content(file_path);
});
watch(() => props.url, async () => {
  if (!props.url) { return }
  let file_path = decodeURIComponent(atob(props.url));
  file.value = await get_file_content(file_path);
});
</script>
<template>
  <div class="h-[100%] flex items-center justify-center overflow-hidden" :key="$route.fullPath">
    <img class="w-max p-[3em]" :src="file" />
  </div>
</template>
