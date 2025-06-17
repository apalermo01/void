<template>
  <div class="w-full h-full overflow-hidden flex flex-col gap-1 items-center justify-center">
    <Skull :size="128" class="text-[var(--destructive)]" />
    <h1 class="text-4xl">Этот тип файлов не поддерживается!</h1>
  </div>
</template>
<script setup lang="ts">
import { Skull } from 'lucide-vue-next';
</script>
<style scoped></style>
