import { invoke } from "@tauri-apps/api/core";
import { Router } from "vue-router";
import { useExplorerStore } from "./explorerstore";

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

export async function decide_file_ext(name: string, router: Router) {
  let ext_map = new Map();
  ext_map.set("mp3", "audio");
  ext_map.set("wav", "audio");
  ext_map.set("ogg", "audio");
  ext_map.set("flac", "audio");
  ext_map.set("alac", "audio");
  ext_map.set("opus", "audio");
  ext_map.set("mp4", "video");
  ext_map.set("mov", "video");
  ext_map.set("avi", "video");
  ext_map.set("pth", "note");
  ext_map.set("txt", "note");
  ext_map.set("md", "note");
  ext_map.set("epub", "book");
  ext_map.set("fb2", "book");
  ext_map.set("pdf", "journal");
  ext_map.set("jpg", "image");
  ext_map.set("png", "image");
  ext_map.set("webp", "image");
  ext_map.set("gif", "image");
  ext_map.set("card", "canvas");
  let extension = name.split('.')[name.split('.').length - 1];
  let workdir = await invoke('get_env', { ename: 'workdir' });
  let explorer = useExplorerStore();
  let file_path = workdir + explorer.current + '/' + name;
  let coded_path = btoa(file_path);
  router.push('/' + ext_map.get(extension) + '/' + coded_path);
}
