use std::{fs, path::Path};

#[tauri::command]
pub fn get_file(ipath: String) -> Vec<u8> {
    let fpath: &Path = Path::new(&ipath);
    fs::read(fpath).unwrap()
}
