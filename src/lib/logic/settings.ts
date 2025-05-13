import { Router } from "vue-router";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useThemeStore } from "./themestore";
import { Component } from "vue";

export type Theme = {
  theme_name: string,
  theme_author: string,
  theme_version: string,
  theme_link: string,
  is_installed: string,

}

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
  if (await invoke('get_env', { ename: 'first_run' }) != 'true' && theme_name != 'lotm') {
    const css = await invoke<string>("get_theme", { name: theme_name });
    if (document.getElementById("custom_theme") == null) {
      let style_el = document.createElement('style');
      style_el.innerHTML = css;
      style_el.id = "custom_theme";
      document.head.appendChild(style_el);
    }
    else if (theme_name == 'lotm') {
      let style_el = document.getElementById("custom_theme");
      style_el?.remove();
      const theme_store = useThemeStore();
      theme_store.change_theme(theme_name);
    }
    else {
      document.getElementById("custom_theme").innerHTML = css;
    }
    const theme_store = useThemeStore();
    theme_store.change_theme(theme_name);
  }
}

export function get_themes_marketplace(object: any[]): any[] {
  return object;
}

export function closePopup(event: any): boolean {
  if (event.target == event.currentTarget) {
    return false;
  }
  else {
    return true;
  }
}

export async function importComponent(name: string): Promise<Component> {
  let component;
  if (name != 'Global') {
    component = await import('./' + name + '.vue');
  }
  return component;
}


export async function get_installed_themes_list(): Promise<string[]> {
  let themes_arr: Theme[] = await invoke("get_list_of_themes", { key: 'installed' });
  console.log(themes_arr);
  let names_arr: string[] = [];
  themes_arr.forEach((theme) => {
    names_arr.push(theme.theme_name);
  });
  return names_arr
}

export async function get_themes_to_download(): Promise<Theme[]> {
  let theme_arr: Theme[] = await invoke("get_list_of_themes", { key: 'not_installed' });
  return theme_arr
}

export async function add_themes_repo(link: string) {
  link = link.replace('https://', '');
  await invoke('create_themes_table', { link: link });
}
