
/**
 * Copyright 2025 The VOID Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
