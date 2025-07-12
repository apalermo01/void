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
use super::{DB, SideRepo, SideRepoField};

#[tauri::command]
pub async fn add_repo(rtype: String, link: String, app: tauri::AppHandle) {
    let db = DB.get().unwrap();
    let side_repo: Vec<SideRepoField> = vec![
        SideRepoField::Type(rtype),
        SideRepoField::Link(link.clone()),
    ];
    let linkparts = link.split('/').collect::<Vec<&str>>();
    db.create::<SideRepoField, SideRepo>(
        side_repo,
        app.clone(),
        "side_repo",
        linkparts.get(2).unwrap(),
    )
    .await
    .unwrap();
}

#[tauri::command]
pub async fn get_repos_list() -> Result<Vec<SideRepo>, String> {
    let db = DB.get().unwrap();
    db.get_all_members::<SideRepo>("side_repo")
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_repo(link: String) -> Result<(), String> {
    let db = DB.get().unwrap();
    let result = db
        .delete("side_repo", "link", link)
        .await
        .map_err(|e| e.to_string());
    println!("{:#?}", result);
    Ok(())
}
