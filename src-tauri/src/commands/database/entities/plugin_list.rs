use serde::{Deserialize, Serialize};
use tauri::Emitter;

use super::{EntityControl, EntityError};

pub enum PluginListFields {
    Name(String),
    Enabled(bool),
}

#[derive(Serialize, Deserialize)]
pub struct PluginList {
    name: String,
    enabled: bool,
}

impl EntityControl<PluginListFields, PluginList> for PluginList {
    fn new(input: Vec<PluginListFields>, app: tauri::AppHandle) -> Result<PluginList, EntityError> {
        if input.len() != 2 {
            return Err(EntityError::WrongInputLength);
        }
        let name = match input.get(0) {
            Some(PluginListFields::Name(s)) => s.clone(),
            _ => {
                return Err(PluginList::throw_error(
                    app.clone(),
                    "Ошибка при инициализации поля Name",
                ));
            }
        };
        let enabled = match input.get(1) {
            Some(PluginListFields::Enabled(enabled)) => enabled.clone(),
            _ => {
                return Err(PluginList::throw_error(
                    app.clone(),
                    "Ошибка при инициализации поля Enabled",
                ));
            }
        };
        Ok(PluginList { name, enabled })
    }

    fn get_value_by_key(&self, key: String, app: tauri::AppHandle) -> Result<String, EntityError> {
        match key.as_str() {
            "name" => Ok(self.name.clone()),
            "enabled" => Ok(self.enabled.clone().to_string()),
            _ => Err(PluginList::throw_error(app.clone(), "NotFound")),
        }
    }
}
