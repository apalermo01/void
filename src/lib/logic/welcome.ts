
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
