#[tauri::command]
pub async fn get_directory_content(dirname: String, app: tauri::AppHandle) -> Vec<String> {
    let workdir = super::get_env("workdir".to_string(), app.clone())
        .await
        .unwrap();
    let paths = std::fs::read_dir(workdir.clone() + "/" + dirname.as_str()).unwrap();
    let dirs: Vec<String> = paths
        .map(|e| e.unwrap().path().to_str().unwrap().to_string())
        .map(|d| d.replace((workdir.clone() + "/").as_str(), ""))
        .collect();
    dirs
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
