import { Router } from "vue-router";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

export function showSettings(router: Router) {
  router.push('settings');
}

export async function changeWorkdir(): Promise<string> {
  let error: string = '';
  const directory: string | null = await open({
    directory: true,
    multiple: false,
  });
  if (directory === null) {
    error = "path not provided";
    return error;
  }
  await invoke('set_env', { ename: 'WORKDIR', name: directory });
  return directory;
}

export async function getWorkdir(): Promise<string> {
  const directory: string = await invoke('get_env', { ename: 'WORKDIR' });
  return directory;
}

export async function getUsername(): Promise<string> {
  const uname: string = await invoke('get_env', { ename: 'NAME' });
  return uname;
}
