<script setup lang="ts">
import { changeWorkdir, getWorkdir } from "@/lib/logic/settings";
import { onMounted, ref } from "vue";
import SettingsButton from "@/components/ui/settings/SettingsButton.vue";
import SettingsHeader from "@/components/ui/settings/SettingsHeader.vue";
import SettingsField from "@/components/ui/settings/SettingsField.vue";
import SettingsComposition from "@/components/ui/settings/SettingsComposition.vue";
let workdir = ref("");
onMounted(async () => {
  workdir.value = await getWorkdir();
});

</script>

<template>
  <h1 class="text-4xl text-center text-accent mt-2">Общие</h1>
  <SettingsHeader value="изменить рабочую директорию" />
  <SettingsComposition>
    <SettingsField :placeholder="workdir" />
    <SettingsButton @click="async () => { workdir = await changeWorkdir(); }" name="Изменить" />
  </SettingsComposition>
</template>
