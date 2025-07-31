import { invoke } from "@tauri-apps/api/core";

export async function get_note(path: String): Promise<string> {
  return await invoke('get_note_content', { path: path });
}

export async function write_note(path: String, content: String) {
  await invoke('write_note_changes', { path: path, value: content })
}
