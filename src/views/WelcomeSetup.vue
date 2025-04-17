<script setup lang="ts">
import { ref } from 'vue';
import { VanishingInput } from '@/components/ui/vanishing-input';
import { LampEffect } from '@/components/ui/lamp-effect';
import { delayedSetup } from '@/lib/logic/account-setup';
let username = ref('');


const placeholders: Array<string> = [
    'Как мне тебя называть?',
    'Может Господин?',
    'Мастер?',
    'internet explorer?',
    'Может просто Андрей?',
    'Или может Саша?',
    'BrawlStarser228?'
]


</script>
<template>
    <div class="form-container">
        <LampEffect>
            <div class="input-wrapper">
                <h1 class="text-rosepine-text text-4xl">Как мне тебя называть?</h1>
                <VanishingInput class="user-input" v-model="username" :placeholders="placeholders"
                    @submit="delayedSetup(username, $router)" />
            </div>
        </LampEffect>
    </div>
</template>

<style scoped>
.form-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3vh;
}

.input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3vh;
}
</style>
