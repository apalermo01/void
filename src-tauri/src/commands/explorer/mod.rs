use dotenvy;
use std::{
    fs::{self, ReadDir},
    path::Path,
};

#[tauri::command]
pub fn get_entry_list(flag: String, subpath: String) -> String {
    dotenvy::dotenv().unwrap();
    let mut workdir: String = dotenvy::var("WORKDIR").unwrap();
    workdir += &subpath;
    let workdir_path: &Path = std::path::Path::new(&workdir);
    let folders: ReadDir = fs::read_dir(workdir_path).unwrap();
    let mut folders_list: Vec<String> = folders
        .map(|folder| String::from(folder.unwrap().path().as_os_str().to_str().unwrap()))
        .filter(|folder| {
            (flag == String::from("dir") && !(folder.contains(".")))
                || (flag == String::from("file") && (folder.contains(".")))
        })
        .map(|folder| folder)
        .collect::<Vec<String>>();
    folders_list.sort();
    folders_list.join("\n")
}
