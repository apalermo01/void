import { defineStore } from "pinia";
export const useSidebarStore = defineStore('sidebar', {
  state: () => ({ current: localStorage.getItem('mindbreaker:sidebar') || 'expanded' }),
  actions: {
    toggle() {
      if (localStorage.getItem('mindbreaker:sidebar') == 'expanded') {
        localStorage.setItem('mindbreaker:sidebar', 'collapsed');
        this.current = 'collapsed';
      }
      else {
        localStorage.setItem('mindbreaker:sidebar', 'expanded');
        this.current = 'expanded';
      }
      console.log(this.current);
    }
  }
})
