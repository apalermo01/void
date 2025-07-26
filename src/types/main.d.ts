import 'vue-i18n';
declare module 'vue-i18n';
declare module 'markdown-it-attrs';
declare module 'markdown-it-container';
declare module 'markdown-it-task-lists';

declare module 'vue-virtual-scroller';

declare module 'vue-plyr' {
  import { PluginObject } from 'vue';
  const VuePlyr: PluginObject<any>;
  export default VuePlyr;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string, ...args: any[]) => string;
  }
}
