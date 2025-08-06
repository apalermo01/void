/**
 * Copyright 2025 The VOID Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
use super::{EntityControl, EntityError};
use serde::{Deserialize, Serialize};
pub enum MainConfigFields {
    Name(String),
    FirstRun(String),
    Workdir(String),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MainConfig {
    name: String,
    first_run: String,
    workdir: String,
}

impl EntityControl<MainConfigFields, MainConfig> for MainConfig {
    fn new(input: Vec<MainConfigFields>, app: tauri::AppHandle) -> Result<MainConfig, EntityError> {
        if input.len() != 3 {
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

        Ok(MainConfig {
            name,
            first_run,
            workdir,
        })
    }

    fn get_value_by_key(&self, key: String) -> Result<String, EntityError> {
        match key.as_str() {
            "name" => Ok(self.name.clone()),
            "first_run" => Ok(self.first_run.clone().to_string()),
            "workdir" => Ok(self.workdir.clone()),
            _ => Err(EntityError::NotFound),
        }
    }
}
