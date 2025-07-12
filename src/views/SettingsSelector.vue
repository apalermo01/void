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

<script setup lang="ts">
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectGroup from '@/components/ui/select/SelectGroup.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectLabel from '@/components/ui/select/SelectLabel.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
</script>
<template>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Настройки" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Настройки</SelectLabel>
        <SelectItem value="Global">
          Общие
        </SelectItem>
        <SelectItem value="Plugins">
          Расширения и кастомизация
        </SelectItem>
        <SelectItem value="SideRepos">
          Кастомные репозитории
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
