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
