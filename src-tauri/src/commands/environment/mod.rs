use crate::commands::database::{DB, EntityError, MainConfig};

use super::EntityControl;

#[tauri::command]
pub async fn get_env(ename: String, _app: tauri::AppHandle) -> Result<String, String> {
    match DB
        .get()
        .unwrap()
        .get::<Option<MainConfig>>("singletone", "main_config")
        .await
    {
        Ok(Some(data)) => match data.get_value_by_key(ename) {
            Ok(str) => Ok(str),
            Err(e) => Err(e.to_string()),
        },
        Ok(None) => Err(EntityError::NotFound.to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn set_env(ename: String, name: String) -> Result<(), String> {
    match DB
        .get()
        .unwrap()
        .update("singletone".to_string(), "main_config", ename, name)
        .await
    {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
