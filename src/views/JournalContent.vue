<template>
    <div class="relative h-[89vh] w-full group select-none m-[1em]" tabindex="0">
        <!-- PDF занимает всю область, input и стрелки поверх -->
        <div ref="scrollContainer"
            class="absolute h-[89vh] w-[calc(100%-2em)] rounded-[1em] inset-0 flex items-center justify-center overflow-auto"
            style="z-index: 10;">
            <VuePdfEmbed v-if="doc" :source="file" :page="currentPage" :style="pdfStyle" />
            <div v-else class="flex items-center justify-center w-full h-full text-white">
                Загрузка PDF...
            </div>
        </div>
        <!-- ЛЕВАЯ СТРЕЛКА -->
        <button class="absolute left-2 top-1/2 -translate-y-1/2
        bg-black/20 text-white text-3xl rounded-full w-14 h-14 flex items-center justify-center
        opacity-0 scale-90 invisible pointer-events-none
        group-hover:opacity-100 group-hover:scale-100 group-hover:visible group-hover:pointer-events-auto
        hover:bg-black/40 transition-all duration-200 z-30" @click="prevPage" :disabled="currentPage <= 1"
            :tabindex="-1" aria-label="Предыдущая страница">←</button>
        <!-- ПРАВАЯ СТРЕЛКА -->
        <button class="absolute right-2 top-1/2 -translate-y-1/2 mr-[1em]
        bg-black/20 text-white text-3xl rounded-full w-14 h-14 flex items-center justify-center
        opacity-0 scale-90 invisible pointer-events-none
        group-hover:opacity-100 group-hover:scale-100 group-hover:visible group-hover:pointer-events-auto
        hover:bg-black/40 transition-all duration-200 z-30" @click="nextPage" :disabled="currentPage >= pageCount"
            :tabindex="-1" aria-label="Следующая страница">→</button>
        <!-- ИНПУТ ДЛЯ СТРАНИЦЫ -->
        <div class="flex gap-2 items-center justify-center
        absolute left-1/2 bottom-8 -translate-x-1/2
        opacity-0 scale-90 invisible pointer-events-none
        group-hover:opacity-100 group-hover:scale-100 group-hover:visible group-hover:pointer-events-auto
        transition-all duration-200 z-30">
            <input
                class="border border-white/30 bg-black/20 text-white w-16 text-center rounded py-1 outline-none placeholder-white/60 transition-colors"
                type="number" :min="1" :max="pageCount" v-model.number="inputPage" @keydown.enter="goToInputPage"
                @blur="goToInputPage" :placeholder="currentPage" autocomplete="off" inputmode="numeric" />
            <span class="text-lg text-white select-none">/ {{ pageCount }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import VuePdfEmbed, { useVuePdfEmbed } from "vue-pdf-embed";
import { get_file_content } from "@/lib/logic/utils";

const props = defineProps<{ url: string }>();

const file = ref<string>("");
const { doc } = useVuePdfEmbed({ source: file });
const pageCount = computed(() => doc.value?.numPages || 1);

const currentPage = ref(1);
const inputPage = ref(1);

const scrollContainer = ref<HTMLDivElement | null>(null);

function scrollPage(offset: number) {
    const el = scrollContainer.value;
    if (el) el.scrollBy({ top: offset });
}

function goToInputPage() {
    if (inputPage.value < 1) inputPage.value = 1;
    if (inputPage.value > pageCount.value) inputPage.value = pageCount.value;
    currentPage.value = inputPage.value;
}

watch(currentPage, (val) => {
    if (val !== inputPage.value) inputPage.value = val;
});
watch(doc, (val) => {
    if (val) {
        currentPage.value = 1;
        inputPage.value = 1;
    }
});

async function loadPDF() {
    if (props.url) {
        const file_path = decodeURIComponent(atob(props.url));
        file.value = await get_file_content(file_path);
    }
}

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
    if (currentPage.value < pageCount.value) currentPage.value++;
}

function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
        prevPage();
        e.preventDefault();
    }
    if (e.key === "ArrowRight") {
        nextPage();
        e.preventDefault();
    }
    if (e.key === "ArrowDown") {
        scrollPage(40);
        e.preventDefault();
    }
    if (e.key === "ArrowUp") {
        scrollPage(-40);
        e.preventDefault();
    }
}

onMounted(() => {
    loadPDF();
    window.addEventListener("keydown", handleKeydown);
});
onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown);
});
watch(() => props.url, async () => {
    loadPDF();
});

const pdfStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    maxWidth: "100%",
    maxHeight: "100%",
    display: "block",
    margin: "0 auto",
};
</script>

<style scoped>
/* Убирает стрелки у инпута */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>
