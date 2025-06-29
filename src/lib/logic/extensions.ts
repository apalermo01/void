import { invoke } from "@tauri-apps/api/core";

export async function add_extension_tables(key: string, link: string) {
  link = link.replace('https://', '');
  let linkparts = link.split('/');
  console.log(linkparts);
  let manifest_data = await fetch('https://raw.githubusercontent.com/' + linkparts[1] + '/' + linkparts[2] + '/main/manifest.json');
  let manifest = await manifest_data.json();
  if (manifest.repo_type == 'Theme') {
    await invoke('create_themes_table', { link: link });
  }
  console.log(manifest);
}
