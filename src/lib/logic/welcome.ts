import { Router } from "vue-router";
import { invoke } from "@tauri-apps/api/core";

export function next_slide(index: number, max_len: number): number {
  index = index == max_len - 1 ? index : index + 1;
  return index;
}

export function prev_slide(index: number): number {
  index = index == 0 ? index : index - 1;
  return index;
}

export function set_bounds(): Object {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

export async function move_to_account(router: Router) {
  await invoke('set_env', { ename: 'first_run', name: 'false' });
  router.push('/setup');
}
