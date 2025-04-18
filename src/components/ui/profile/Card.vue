<script setup lang="ts">
	import CardContainer from '../card-3d/CardContainer.vue';
	import CardBody from '../card-3d/CardBody.vue';
	import CardItem from '../card-3d/CardItem.vue';

	let props = defineProps(['uname', 'pic']);
</script>
<template>
            <CardContainer>
                <CardBody
                    class="group/card relative size-auto rounded-xl border border-black/[0.1] bg-rosepine-base p-6 sm:w-[20rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
                    <CardItem :translate-z="50" class="text-xl font-bold text-rosepine-love dark:text-white">
                        {{ props.uname }}
                    </CardItem>
                    <CardItem as="p" translate-z="60"
                        class="mt-2 max-w-sm text-sm text-rosepine-rose dark:text-neutral-300 text-center">
                        Раскрой свой потенциал!
                    </CardItem>
                    <CardItem :translate-z="100" :rotate-x="20" :rotate-z="10" class="mt-4 w-full">
                        <img :src="props.pic" height="1500" width="1500"
                            class="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl" />
                    </CardItem>
                    <div class="mt-20 flex items-center justify-between">
                        <CardItem :translate-z="20"
                            class="rounded-xl px-4 py-2 text-lg text-rosepine-love font-normal dark:text-white">
                            0
                        </CardItem>
                        <CardItem :translate-z="20"
                            class="rounded-xl bg-rosepine-rose px-4 py-2 text-xs font-bold text-rosepine-base dark:bg-white dark:text-black">
                            The Creator
                        </CardItem>
                    </div>
                </CardBody>
            </CardContainer>
</template>
