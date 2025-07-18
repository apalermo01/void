import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import router from "./router/index";
import { createPinia } from "pinia";
import App from "./App.vue";
import VueVirtualScroller from 'vue-virtual-scroller';
import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';
import '@excalidraw/excalidraw/index.css'

const pinia = createPinia();
const i18n = createI18n({
    locale: 'en',
    messages: {
        en: {
            loader: {
                loader: 'Came. Saw. Wrote.'
            }
        },

        ru: {
            loader: {
                loader: 'Пришел. Увидел. Записал.'
            }
        }
    }
});
createApp(App).use(router).use(pinia).use(VueVirtualScroller).use(i18n).use(VuePlyr, {
    plyr: {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'captions',
        'settings',
        'pip',
        'fullscreen'
      ]
    }
  }).mount("#app");
