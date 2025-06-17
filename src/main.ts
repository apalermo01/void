import { createApp } from "vue";
import router from "./router/index";
import { createPinia } from "pinia";
import App from "./App.vue";
import VueVirtualScroller from 'vue-virtual-scroller';
import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';

const pinia = createPinia();
createApp(App).use(router).use(pinia).use(VueVirtualScroller).use(VuePlyr, {
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
