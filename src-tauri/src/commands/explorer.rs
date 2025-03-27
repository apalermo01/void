use dotenvy;
use std::fs;

#[tauri::command]
pub fn get_entry_list(flag: String) -> String {
    dotenvy::dotenv().unwrap();
    let workdir = dotenvy::var("WORKDIR").unwrap();
    let workdir_path = std::path::Path::new(&workdir);
    let folders = fs::read_dir(workdir_path).unwrap();
    let mut folders_list = folders
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
