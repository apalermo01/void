<script setup>
import { FlickeringGrid } from '@/components/ui/flickering-grid';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { ref } from 'vue';
import 'primeicons/primeicons.css';
import { prev_slide, next_slide, set_bounds, move_to_account } from '@/lib/logic/welcome';


const welcome_info = [
    'Добро пожаловать в mindbreaker путник!',
    'Это мое новое творение которое я создал как сайд-проект.',

    'Основная суть - создать второй мозг который не будет так сложен в настройке как obsidian или notion.',
    'Но главное - оставить все такую же гибкость настройки и использования!',
    'Надеюсь тебе понравится!'
];
let index = ref(0);
let bounds = ref({ width: 0, height: 0 });
bounds.value = set_bounds();

window.addEventListener("resize", () => {
    bounds.value = set_bounds();
    console.log(bounds.value);
})

</script>
<template>
    <div class="relative w-full overflow-hidden rounded-lg bg-background">
        <FlickeringGrid
            class="relative inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
            :square-size="4" :grid-gap="6" color="#60A5FA" :max-opacity="0.5" :flicker-chance="0.1"
            :width="bounds.width" :height="bounds.height" />
    </div>
    <div class="animation-container">
        <BlurReveal :delay="0.2" :duration="0.75" :key="index" class="p-8">
            <h2 class="reveal-text">{{ welcome_info[index] }}</h2>
        </BlurReveal>
        <div class="bottom-nav">
            <span class="pi pi-angle-left arrow" @click="index = prev_slide(index, welcome_info.length)"></span>
            <InteractiveHoverButton class="lessgo-button" text="Поехали!" v-if="index == welcome_info.length - 1"
                @click="move_to_account($router)">
                Поехали!
            </InteractiveHoverButton>
            <span class="pi pi-angle-right arrow" @click="index = next_slide(index, welcome_info)"></span>
        </div>
    </div>
</template>
<style scoped>
.animation-container {
    background-color: rgba(255, 255, 255, 0);
    padding: 5%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
}

.reveal-text {
    color: white;
    font-size: 4vh;
    text-align: center;
}

.bottom-nav {
    display: flex;
    justify-content: center;
    bottom: 30%;
    position: fixed;
    align-items: center;
    gap: 1em;
}

.arrow {
    color: white;
    font-size: 3em;
}

.lessgo-button {
    width: 9em;
    border-radius: 15.5px;
    background: white;
}
</style>
