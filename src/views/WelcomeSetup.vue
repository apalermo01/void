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
import { ref } from 'vue';
import { VanishingInput } from '@/components/ui/vanishing-input';
import { LampEffect } from '@/components/ui/lamp-effect';
import { delayedSetup } from '@/lib/logic/account-setup';
let username = ref('');


// TODO: same translation setup as Welcome Animation
// const placeholders: Array<string> = [
//   'Как мне тебя называть?',
//   'Может Господин?',
//   'Мастер?',
//   'internet explorer?',
//   'Может просто Андрей?',
//   'Или может Саша?',
//   'BrawlStarser228?'
// ]
const placeholders: Array<string> = [
  'What should I call you?',
  'Maybe Sir?',
  'Master?',
  'internet explorer?',
  'Maybe just Andrey?',
  'Or maybe Sasha?',
  'BrawlStarser228?'
]


</script>
<template>
  <div class="form-container">
    <LampEffect>
      <div class="input-wrapper">
        <h1 class="text-rosepine-text text-4xl">{{ $t('welcomeSetup.namePrompt') }}</h1>
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
