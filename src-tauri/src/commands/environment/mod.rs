use crate::commands::database::{DB, EntityError, MainConfig};
use std::fs;

use super::EntityControl;

#[tauri::command]
pub async fn get_env(ename: String, app: tauri::AppHandle) -> Result<String, String> {
    match DB
        .get()
        .unwrap()
        .get::<Option<MainConfig>>("singletone", "main_config")
        .await
    {
        Ok(Some(data)) => match data.get_value_by_key(ename, app.clone()) {
            Ok(str) => return Ok(str),
            Err(e) => return Err(e.to_string()),
        },
        Ok(None) => return Err(EntityError::NotFound.to_string()),
        Err(e) => return Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn set_env(ename: String, name: String) -> Result<(), String> {
    match DB
        .get()
        .unwrap()
        .update("singletone", "main_config", ename, name)
        .await
    {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
