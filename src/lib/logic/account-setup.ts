import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { Router } from "vue-router";

async function setup(name: string, router: Router) {
  await invoke('set_env', { ename: 'name', name: name });
  const folder = await open({
    multiple: false,
    directory: true
  })
  await invoke('set_env', { ename: 'workdir', name: folder });
  router.push('/');
}

export async function delayedSetup(name: string, router: Router) {
  setTimeout(async () => await setup(name, router), 1000);
}
