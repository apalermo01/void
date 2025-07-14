<!--
Copyright 2025 The VOID Authors. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->
<template>
  <div class="w-full h-full overflow-auto">
    <code-mirror v-model="content" ref="Editor" class="editor"></code-mirror>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import CodeMirror from 'vue-codemirror6';
import { invoke } from '@tauri-apps/api/core';
let props = defineProps({
  url: String
});
let content = ref('');
defineComponent({
  components: { CodeMirror }, setup() {
    return { content };
  }
});

onMounted(async () => {
  if (!props.url) { return }
  content.value = await invoke('get_note_content', { path: decodeURIComponent(atob(props.url)) });
})
</script>
<style>
.editor {
  margin: 3em;
  border: none;
  outline: none;
}

:focus {
  outline: none;
}

.tiptap h1 {
  color: var(--destructive);
  font-size: 2em;
}

.tiptap li {
  padding-left: 1em;
}
</style>
