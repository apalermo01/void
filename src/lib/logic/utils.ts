import { invoke } from "@tauri-apps/api/core";

export async function get_file_content(
  path: string,
  intype: string,
): Promise<string> {
  let bytes: Uint8Array = await invoke("get_file", { ipath: path });
  let url = URL.createObjectURL(
    new Blob([new Uint8Array(bytes)], { type: intype }),
  );
  return url;
}

export function checkShowable(): boolean {
  if (window.innerHeight >= window.innerWidth) {
    return false;
  } else {
    return true;
  }
}

export async function get_folder_content(dirname: string): Promise<String[]> {
  return await invoke("get_directory_content", { dirname: dirname });
}
