use std::clone;

use super::{EntityControl, EntityError};

pub enum PluginSettingsFields {
    Name(String),
    Type(String),
    UiSize(i8),
    Other(String),
}

pub struct PluginSettings {
    name: String,
    ui_type: String,
    ui_size: i8,
    other: String,
}

impl EntityControl<PluginSettingsFields, PluginSettings> for PluginSettings {
    fn new(
        input: Vec<PluginSettingsFields>,
        app: tauri::AppHandle,
    ) -> Result<PluginSettings, EntityError> {
        if input.len() != 5 {
            return Err(EntityError::WrongInputLength);
        }

        let name = match input.get(0) {
            Some(PluginSettingsFields::Name(name)) => name.clone(),
            _ => {
                return Err(PluginSettings::throw_error(
                    app,
                    "Ошибка при инициализации поля Name",
                ));
            }
        };
        let ui_type = match input.get(1) {
            Some(PluginSettingsFields::Type(t)) => t.clone(),
            _ => {
                return Err(PluginSettings::throw_error(
                    app.clone(),
                    "Ошибка при инициализации поля Type",
                ));
            }
        };
        let ui_size = match input.get(2) {
            Some(PluginSettingsFields::UiSize(size)) => *size,
            _ => {
                return Err(PluginSettings::throw_error(
                    app,
                    "Ошибка при инициализации поля UiSize",
                ));
            }
        };
        let other = match input.get(3) {
            Some(PluginSettingsFields::Other(other)) => other.clone(),
            _ => {
                return Err(PluginSettings::throw_error(
                    app,
                    "Ошибка при инициализации поля other",
                ));
            }
        };

        Ok(PluginSettings {
            name,
            ui_type,
            ui_size,
            other,
        })
    }

    fn get_value_by_key(&self, key: String) -> Result<String, EntityError> {
        match key.as_str() {
            "name" => Ok(self.name.clone()),
            "type" => Ok(self.ui_type.clone()),
            "ui_size" => Ok(self.ui_size.to_string().clone()),
            "other" => Ok(self.other.clone()),
            _ => Err(EntityError::NotFound),
        }
    }
}
