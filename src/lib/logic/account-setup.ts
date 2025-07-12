
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
import { open } from "@tauri-apps/plugin-dialog";
import { Router } from "vue-router";

async function setup(name: string, router: Router) {
  await invoke('set_env', { ename: 'name', name: name });
  const folder = await open({
    multiple: false,
    directory: true
  })
  await invoke('set_env', { ename: 'workdir', name: folder });
  await invoke('setup_config_directory');
  await invoke('allow_scope');
  router.push('/');
}

export async function delayedSetup(name: string, router: Router) {
  setTimeout(async () => await setup(name, router), 1000);
}
