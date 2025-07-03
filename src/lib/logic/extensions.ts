import { invoke } from "@tauri-apps/api/core";

export async function add_extension_tables(link: string) {
  link = link.replace('https://', '');
  let linkparts = link.split('/');
  let manifest_data = await fetch('https://raw.githubusercontent.com/' + linkparts[1] + '/' + linkparts[2] + '/main/manifest.json');
  let manifest = await manifest_data.json();
  console.log(manifest.repo_type);
  if (manifest.repo_type == 'Theme') {
    await invoke('create_themes_table', { link: link });
    console.log('pisun1');
  }
  else {
    await invoke('create_plugins_table', { url: link });
    console.log('pisun');
  }
}

export async function get_plugins_list(key: string): Promise<any[]> {
  let list = await invoke<any[]>('get_list_of_plugins', { key: key });
  return list;
}

export async function install_plugin(key: string) {
  await invoke('clone_plugin', { key: key });
}
