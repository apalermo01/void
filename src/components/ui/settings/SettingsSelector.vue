<script setup lang="ts">
import Select from '../select/Select.vue';
import SelectItem from '../select/SelectItem.vue';
import SelectGroup from '../select/SelectGroup.vue';
import SelectLabel from '../select/SelectLabel.vue';
import SelectContent from '../select/SelectContent.vue';
import SelectValue from '../select/SelectValue.vue';
import SelectTrigger from '../select/SelectTrigger.vue';
import { defineProps } from 'vue';
import { set_theme } from '@/lib/logic/settings';
let props = defineProps({
	selectorPlaceholder: String,
	currentVal: String,
	valList: [String]
});
</script>
<template>
	<Select>
		<SelectTrigger>
			<SelectValue>{{ props.currentVal }}</SelectValue>
		</SelectTrigger>
		<SelectContent>
			<SelectGroup>
				<SelectLabel>{{ props.selectorPlaceholder }}</SelectLabel>
				<SelectItem v-for="val in props.valList" :value="val" @select="set_theme(val)"> {{ val
				}}
				</SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>
</template>
