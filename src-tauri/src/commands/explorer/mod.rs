use std::{
    fs::{self, ReadDir},
    path::Path,
};

#[tauri::command]
pub fn get_entry_list(flag: String, subpath: String) -> String {
    todo!();
}
