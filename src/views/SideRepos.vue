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
    <h1 class="text-4xl text-center text-accent mt-2">{{ $t('common.sideRpos') }}</h1>
  <div class="flex gap-[1em] ml-[2em] mt-[2em]">
    <Input class="placeholder:text-[var(--card-nested-foreground)] bg-[var(--card-nested)] w-[50%]" type="text"
      v-model="link" />
    <SettingsButton @click="async () => { await import_repo(link) }" name="Добавить" />
  </div>
  <SettingsHeader value="Добавленные репозитории" />
  <div class="repos-list" v-for="repo in repos">
    <h1>{{ repo.link }}</h1>
    <SettingsButton name="Удалить" @click="async () => { await delete_repo(repo.link); repos = await get_repos(); }" />
  </div>
</template>
<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import SettingsButton from '@/components/ui/settings/SettingsButton.vue';
import SettingsHeader from '@/components/ui/settings/SettingsHeader.vue';
import { add_extension_tables } from '@/lib/logic/extensions';
import { delete_repo, get_repos, SideRepo } from '@/lib/logic/settings';
import { onMounted, ref } from 'vue';
let link = ref('');
let repos = ref<SideRepo[]>([]);

async function import_repo(link: string) {
  await add_extension_tables(link);
  repos.value = await get_repos();
}

onMounted(async () => {
  repos.value = await get_repos();
})
</script>
<style scoped>
.repos-list {
  width: 60%;
  margin-left: 2em;
  margin-top: 1em;
  display: flex;
  gap: 1em;
  align-items: center;
}

.repos-list h1 {
  width: 60%;
  padding: 0.5em;
  border: 1px solid var(--accent);
  border-radius: 25px;
}
</style>
