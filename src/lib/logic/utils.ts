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

export async function create_file(name: string, dirname: string) {
  let res = await invoke("create_entry", { name: name, path: dirname, flag: "file" });
  console.log(res);
}

export async function create_folder(name: string, dirname: string) {
  let res = await invoke("create_entry", { name: name, path: dirname, flag: "folder" });
  console.log(res);
}

export async function delete_folder(name: string, dirname: string) {
  await invoke("remove", { name: name, path: dirname, flag: "folder" });
}

export async function delete_file(name: string, dirname: string) {
  await invoke("remove", { name: name, path: dirname, flag: "file" });
}
