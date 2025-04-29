use super::{EntityControl, EntityError};

pub enum PluginSettingsFields {
    Name(String),
    Ui(bool),
    SidePanel(bool),
    UiSize(i8),
    Other(String),
}

pub struct PluginSettings {
    name: String,
    ui: bool,
    side_panel: bool,
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
        let ui = match input.get(1) {
            Some(PluginSettingsFields::Ui(ui)) => *ui,
            _ => {
                return Err(PluginSettings::throw_error(
                    app,
                    "Ошибка при инициализации поля Ui",
                ));
            }
        };
        let side_panel = match input.get(2) {
            Some(PluginSettingsFields::SidePanel(side_panel)) => *side_panel,
            _ => {
                return Err(PluginSettings::throw_error(
                    app,
                    "Ошибка при инициализации поля SidePanel",
                ));
            }
        };
        let ui_size = match input.get(3) {
            Some(PluginSettingsFields::UiSize(size)) => *size,
            _ => {
                return Err(PluginSettings::throw_error(
                    app,
                    "Ошибка при инициализации поля UiSize",
                ));
            }
        };
        let other = match input.get(4) {
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
            ui,
            side_panel,
            ui_size,
            other,
        })
    }

    fn get_value_by_key(&self, key: String, app: tauri::AppHandle) -> Result<String, EntityError> {
        match key.as_str() {
            "name" => Ok(self.name.clone()),
            "ui" => Ok(self.ui.clone().to_string()),
            "side_panel" => Ok(self.side_panel.to_string().clone()),
            "ui_size" => Ok(self.ui_size.to_string().clone()),
            "other" => Ok(self.other.clone()),
            _ => Err(PluginSettings::throw_error(app.clone(), "NotFound")),
        }
    }
}
