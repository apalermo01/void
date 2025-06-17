<template>
  <div class="w-full h-full overflow-auto">
    <EditorContent class="editor" :editor="Editor" />
  </div>
</template>
<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit'
import { onMounted, ref } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { Markdown } from 'tiptap-markdown';
let props = defineProps({
  url: String
});
let content = ref('');
const Editor = useEditor({
  content: '',
  extensions: [StarterKit, Markdown.configure({
    html: true,
  })],
  parseOptions: {
    preserveWhitespace: "full"
  }
}
);
onMounted(async () => {
  if (!props.url) { return }
  content.value = await invoke('get_note_content', { path: decodeURIComponent(atob(props.url)) });
  Editor.value?.commands.setContent(content.value);
  Editor.value?.chain().focus().run();
})
</script>
<style>
.editor {
  margin: 3em;
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
