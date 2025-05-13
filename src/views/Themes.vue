<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import SettingsButton from '@/components/ui/settings/SettingsButton.vue';
import { add_themes_repo } from '@/lib/logic/settings';
import { ref } from 'vue';
let link = ref('');

async function import_repo(link: string) {
    await add_themes_repo(link);
}
</script>
<template>
    <h1 class="text-4xl text-center text-accent mt-2">Внешний вид</h1>
    <div class="flex gap-[1em] ml-[2em] mt-[2em]">
        <Input class="placeholder:text-[var(--card-nested-foreground)] bg-[var(--card-nested)] w-[50%]" type="text"
            v-model="link" />
        <SettingsButton @click="async () => { await import_repo(link) }" />
    </div>
</template>
