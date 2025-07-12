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
pub enum SideRepoField {
    Type(String),
    Link(String),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SideRepo {
    repo_type: String,
    link: String,
}

impl EntityControl<SideRepoField, SideRepo> for SideRepo {
    fn new(input: Vec<SideRepoField>, app: tauri::AppHandle) -> Result<SideRepo, EntityError> {
        let repo_type = match input.first() {
            Some(SideRepoField::Type(s)) => s.clone(),
            _ => {
                SideRepo::throw_error(app.clone(), "Type");
                "?".to_string()
            }
        };
        let link = match input.get(1) {
            Some(SideRepoField::Link(s)) => s.clone(),
            _ => {
                SideRepo::throw_error(app.clone(), "Link");
                "?".to_string()
            }
        };
        Ok(SideRepo { repo_type, link })
    }
    fn get_value_by_key(&self, key: String) -> Result<String, EntityError> {
        match key.as_str() {
            "type" => Ok(self.repo_type.clone()),
            "link" => Ok(self.link.clone()),
            _ => Err(EntityError::NotFound),
        }
    }
}

impl Clone for SideRepo {
    fn clone(&self) -> Self {
        Self {
            link: self.link.clone(),
            repo_type: self.repo_type.clone(),
        }
    }
}
