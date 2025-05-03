use super::{DB, EntityControl, MainConfig};
use std::fs;

#[tauri::command]
pub async fn get_theme(name: String, app: tauri::AppHandle) -> Result<String, String> {
    let config = DB
        .get()
        .unwrap()
        .get::<MainConfig>("singletone", "main_config")
        .await
        .map_err(|e| e.to_string())?;
    let workdir = config
        .get_value_by_key("workdir".to_string(), app.clone())
        .map_err(|e| e.to_string())?;
    let path = format!("{}/.conf/themes/{}/theme.css", workdir, name);
    let path = std::path::Path::new(&path);
    fs::read_to_string(path).map_err(|e| e.to_string())
}
