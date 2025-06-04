use super::EntityError;
use std::result::Result;
use tauri::Emitter;

pub trait EntityControl<B, T> {
    fn new(input: Vec<B>, app: tauri::AppHandle) -> Result<T, EntityError>;
    fn get_value_by_key(&self, key: String) -> Result<String, EntityError>;
    fn throw_error(app: tauri::AppHandle, err_val: &'static str) -> EntityError {
        let _ = app.emit("error", err_val);
        EntityError::InvalidField(err_val)
    }
}
