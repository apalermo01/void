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
