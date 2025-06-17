use jwalk::WalkDir;
use std::path::PathBuf;

use super::get_env;

#[tauri::command]
pub async fn list_dir_paged(
    dirname: String,
    offset: usize,
    limit: usize,
    app: tauri::AppHandle,
) -> Result<Vec<String>, String> {
    let workdir = super::get_env("workdir".into(), app.clone()).await.unwrap();
    let root = workdir + dirname.as_str();
    println!("{:#?}", root);
    let files = WalkDir::new(&root)
        .max_depth(1)
        .skip_hidden(true)
        .sort(false)
        .into_iter()
        .skip(offset)
        .take(limit)
        .filter_map(|entry| {
            let path = entry
                .ok()?
                .path()
                .strip_prefix(&root)
                .ok()?
                .to_str()?
                .to_owned();
            Some(path)
        })
        .collect();
    Ok(files)
}

#[tauri::command]
pub async fn create_entry(
    name: String,
    path: String,
    flag: String,
    app: tauri::AppHandle,
) -> Result<(), String> {
    let workdir = super::get_env("workdir".to_string(), app.clone()).await?;
    let path = workdir + path.as_str() + name.as_str();
    println!("{}", flag);
    println!("{}", path);
    let path = std::path::Path::new(&path);
    match flag.as_str() {
        "folder" => std::fs::create_dir(path).map_err(|e| e.to_string())?,
        "file" => std::fs::write(path, "").map_err(|e| e.to_string())?,
        _ => return Err("нет такого флага".to_string()),
    }
    Ok(())
}

#[tauri::command]
pub async fn remove(
    name: String,
    path: String,
    flag: String,
    app: tauri::AppHandle,
) -> Result<(), String> {
    let workdir = super::get_env("workdir".to_string(), app.clone()).await?;
    let path = workdir + path.as_str() + name.as_str();
    let path = std::path::Path::new(&path);
    match flag.as_str() {
        "folder" => std::fs::remove_dir_all(path).map_err(|e| e.to_string())?,
        "file" => std::fs::remove_file(path).map_err(|e| e.to_string())?,
        _ => return Err("нет такого флага".to_string()),
    }
    Ok(())
}

#[tauri::command]
pub async fn rename(path: String, new_name: String, app: tauri::AppHandle) -> Result<(), String> {
    let workdir = get_env("workdir".to_string(), app.clone()).await.unwrap();
    let path = workdir + path.as_str();
    let new_path = path.replace(path.split("/").last().unwrap(), &new_name);
    let _ = std::fs::rename(&path, new_path);
    Ok(())
}
