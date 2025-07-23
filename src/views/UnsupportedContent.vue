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
  <div class="w-full h-full overflow-hidden flex flex-col gap-1 items-center justify-center">
    <Skull :size="128" class="text-[var(--destructive)]" />
    <h1 class="text-4xl">{{ $t('unsupportedContent.filetypenotSupportedMsg')  }}</h1>
  </div>
</template>
<script setup lang="ts">
import { Skull } from 'lucide-vue-next';
</script>
<style scoped></style>
