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
                    Плагины
                </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>
