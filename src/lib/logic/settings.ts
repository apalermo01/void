import { Router } from "vue-router";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useThemeStore } from "./themestore";

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
  await invoke('set_env', { ename: 'workdir', name: directory });
  return directory;
}

export async function getWorkdir(): Promise<string> {
  const directory: string = await invoke('get_env', { ename: 'workdir' });
  return directory;
}

export async function getUsername(): Promise<string> {
  const uname: string = await invoke('get_env', { ename: 'name' });
  return uname;
}

export async function set_theme(theme_name: string) {
  const css = await invoke<string>("get_theme", { name: theme_name });
  if (document.getElementById("custom_theme") == null) {
    let style_el = document.createElement('style');
    style_el.innerHTML = css;
    document.head.appendChild(style_el);
  }
  const theme_store = useThemeStore();
  theme_store.change_theme(theme_name);
}

export async function get_themes_marketplace() {

}

