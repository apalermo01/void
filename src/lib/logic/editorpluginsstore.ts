import { defineStore } from "pinia";
export const useEditorPluginStore = defineStore('editor', {
  state: () => ({ current: localStorage.getItem('mindbreaker:editor:plugins') || JSON.stringify(['']) }),
  actions: {
  }
})
