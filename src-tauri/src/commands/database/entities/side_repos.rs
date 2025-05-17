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
        let repo_type = match input.get(0) {
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
    fn get_value_by_key(&self, key: String, app: tauri::AppHandle) -> Result<String, EntityError> {
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
