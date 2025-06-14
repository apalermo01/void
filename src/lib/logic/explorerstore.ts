import { defineStore } from "pinia";
export const useExplorerStore = defineStore('explorer', {
  state: () => ({ current: localStorage.getItem('mindbreaker:explorer') || '' }),
  actions: {
    add_path(folder: string) {
      this.current += "/" + folder;
      localStorage.setItem('mindbreaker:explorer', this.current)
    },
    remove_path() {
      let path_to_remove = "/" + this.current.split('/')[this.current.split("/").length - 1];
      this.current = this.current.replace(path_to_remove, "");
      console.log(this.current);
      localStorage.setItem('mindbreaker:explorer', this.current)
      console.log('gig')
    }
  }
})
