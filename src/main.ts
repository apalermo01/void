import { createApp } from "vue";
import router from "./router/index";
import { createPinia } from "pinia";
import App from "./App.vue";
import VueVirtualScroller from 'vue-virtual-scroller';
const pinia = createPinia();
createApp(App).use(router).use(pinia).use(VueVirtualScroller).mount("#app");
