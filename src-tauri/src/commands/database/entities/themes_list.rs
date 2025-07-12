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

#[derive(Serialize, Deserialize)]
pub enum ThemeRepoField {
    Name(String),
    Author(String),
    Version(String),
    Link(String),
    Installed(String),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ThemeRepo {
    theme_name: String,
    theme_author: String,
    theme_version: String,
    theme_link: String,
    is_installed: String,
}

impl EntityControl<ThemeRepoField, ThemeRepo> for ThemeRepo {
    fn new(input: Vec<ThemeRepoField>, app: tauri::AppHandle) -> Result<ThemeRepo, EntityError> {
        let name = match input.first() {
            Some(ThemeRepoField::Name(s)) => s.clone(),
            _ => {
                ThemeRepo::throw_error(app.clone(), "Type");
                "?".to_string()
            }
        };
        let author = match input.get(1) {
            Some(ThemeRepoField::Author(s)) => s.clone(),
            _ => {
                ThemeRepo::throw_error(app.clone(), "Link");
                "?".to_string()
            }
        };

        let version = match input.get(2) {
            Some(ThemeRepoField::Version(s)) => s.clone(),
            _ => {
                ThemeRepo::throw_error(app.clone(), "Version");
                "?".to_string()
            }
        };

        let link = match input.get(3) {
            Some(ThemeRepoField::Link(s)) => s.clone(),
            _ => {
                ThemeRepo::throw_error(app.clone(), "Link");
                "?".to_string()
            }
        };

        let installed = match input.get(4) {
            Some(ThemeRepoField::Installed(s)) => s.clone(),
            _ => {
                ThemeRepo::throw_error(app.clone(), "Enabled");
                "?".to_string()
            }
        };

        Ok(ThemeRepo {
            theme_name: name,
            theme_author: author,
            theme_version: version,
            theme_link: link,
            is_installed: installed,
        })
    }
    fn get_value_by_key(&self, key: String) -> Result<String, EntityError> {
        match key.as_str() {
            "name" => Ok(self.theme_name.clone()),
            "author" => Ok(self.theme_author.clone()),
            "version" => Ok(self.theme_version.clone()),
            "link" => Ok(self.theme_link.clone()),
            "installed" => Ok(self.is_installed.clone()),
            _ => Err(EntityError::NotFound),
        }
    }
}

impl Clone for ThemeRepo {
    fn clone(&self) -> Self {
        ThemeRepo {
            theme_name: self.theme_name.clone(),
            theme_author: self.theme_author.clone(),
            theme_link: self.theme_link.clone(),
            theme_version: self.theme_version.clone(),
            is_installed: self.is_installed.clone(),
        }
    }
}
