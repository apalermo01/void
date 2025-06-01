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
