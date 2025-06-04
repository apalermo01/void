use super::{EntityControl, EntityError};
use serde::{Deserialize, Serialize};
pub enum MainConfigFields {
    Name(String),
    FirstRun(String),
    Workdir(String),
    NvimPath(String),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MainConfig {
    name: String,
    first_run: String,
    workdir: String,
    nvim_path: String,
}

impl EntityControl<MainConfigFields, MainConfig> for MainConfig {
    fn new(input: Vec<MainConfigFields>, app: tauri::AppHandle) -> Result<MainConfig, EntityError> {
        if input.len() != 4 {
            return Err(EntityError::WrongInputLength);
        }
        let name = match input.first() {
            Some(MainConfigFields::Name(name)) => name.clone(),
            _ => {
                return Err(MainConfig::throw_error(
                    app.clone(),
                    "Некорректное поле Name",
                ));
            }
        };
        let first_run = match input.get(1) {
            Some(MainConfigFields::FirstRun(used)) => used.clone(),
            _ => {
                return Err(MainConfig::throw_error(
                    app.clone(),
                    "Некорректное поле FirstRun",
                ));
            }
        };
        let workdir = match input.get(2) {
            Some(MainConfigFields::Workdir(dir)) => dir.clone(),
            _ => {
                return Err(MainConfig::throw_error(
                    app.clone(),
                    "Некорректное поле Workdir",
                ));
            }
        };

        let nvim_path = match input.get(3) {
            Some(MainConfigFields::NvimPath(path)) => path.clone(),
            _ => {
                return Err(MainConfig::throw_error(
                    app,
                    "Ошибка при инициализации поля NvimPath",
                ));
            }
        };

        Ok(MainConfig {
            name,
            first_run,
            workdir,
            nvim_path,
        })
    }

    fn get_value_by_key(&self, key: String) -> Result<String, EntityError> {
        match key.as_str() {
            "name" => Ok(self.name.clone()),
            "first_run" => Ok(self.first_run.clone().to_string()),
            "workdir" => Ok(self.workdir.clone()),
            "nvim_path" => Ok(self.nvim_path.clone()),
            _ => Err(EntityError::NotFound),
        }
    }
}
