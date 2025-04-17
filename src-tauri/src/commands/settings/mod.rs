use std::fs;
use std::path::Path;

#[tauri::command]
pub fn get_settings_list() -> String {
    let path = Path::new("./settings/settings.json");
    let file = fs::read(path).unwrap();
    String::from_utf8(file).unwrap()
}
