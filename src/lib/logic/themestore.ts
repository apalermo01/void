import { defineStore } from "pinia"
export const useThemeStore = defineStore('theme', {
  state: () => ({ current: '' }),
  actions: {
    change_theme(name: string) {
      this.current = name;
      localStorage.setItem('mindbreaker:theme', name)
    }
  }
})
