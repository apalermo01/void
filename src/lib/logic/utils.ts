import { invoke } from "@tauri-apps/api/core";
import { Router } from "vue-router";
import { useExplorerStore } from "./explorerstore";
import { readFile } from "@tauri-apps/plugin-fs";

export async function get_file_content(
  path: string,
): Promise<string> {
  //let bytes: Uint8Array = await invoke("get_file", { ipath: path });
  //let url = URL.createObjectURL(
  //  new Blob([new Uint8Array(bytes)], { type: intype }),
  //);
  const binary = await readFile(path);
  const blob = new Blob([new Uint8Array(binary)]);
  const url = URL.createObjectURL(blob);
  return url;
}

export function checkShowable(): boolean {
  if (window.innerHeight >= window.innerWidth) {
    return false;
  } else {
    return true;
  }
}

export async function get_folder_content_paged(
  dirname: string,
  offset: number,
  limit: number
): Promise<string[]> {
  return await invoke("list_dir_paged", {
    dirname,
    offset,
    limit,
  });
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
  ext_map.set("m4a", "audio");
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
  name = name.replaceAll(' ', '\ ');
  let file_path = workdir + explorer.current + '/' + name;
  let coded_path = btoa(encodeURIComponent(file_path));
  console.log(coded_path);
  router.push('/' + ext_map.get(extension) + '/' + coded_path);
}
