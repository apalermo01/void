<template>
    <div class="m-[1em] h-[89vh] overflow-y-scroll space-y-8">
        <div v-for="(pageNum, i) in pageNums" :key="pageNum" ref="setPageRef"
            class="min-h-[100vh] flex items-center justify-center">
            <VuePdfEmbed v-if="pageVisibility[pageNum]" :source="file" :page="pageNum" annotation-layer text-layer
                class="max-w-full shadow-md" />
            <div v-else class="text-xs text-muted opacity-50">Загрузка страницы {{ pageNum }}…</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import VuePdfEmbed, { useVuePdfEmbed } from "vue-pdf-embed";
import { get_file_content } from "@/lib/logic/utils";
import "vue-pdf-embed/dist/styles/annotationLayer.css";
import "vue-pdf-embed/dist/styles/textLayer.css";

const props = defineProps<{ url: string }>();

const file = ref("");
const pageNums = ref([]);
const pageRefs = ref<HTMLElement[]>([]);
const pageVisibility = ref<Record<number, boolean>>({});
let observer: IntersectionObserver | null = null;

onMounted(async () => {
    if (props.url) {
        const file_path = decodeURIComponent(atob(props.url));
        file.value = await get_file_content(file_path);
    }

    const { doc } = useVuePdfEmbed({ source: file });
    pageNums.value = doc.value ? [...Array(doc.value.numPages + 1).keys()].slice(1) : [];
});

function setPageRef(el: HTMLElement | null) {
    if (el && !pageRefs.value.includes(el)) {
        pageRefs.value.push(el);
    }
}

function setupObserver() {
    observer?.disconnect();
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = pageRefs.value.indexOf(entry.target as HTMLElement);
                const pageNum = pageNums.value[index];
                pageVisibility.value[pageNum] = true;
            }
        });
    }, {
        rootMargin: "500px",
    });

    pageRefs.value.forEach((el) => {
        observer!.observe(el);
    });
}

onBeforeUnmount(() => {
    observer?.disconnect();
});
</script>
