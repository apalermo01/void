use super::get_env;

#[tauri::command]
pub async fn read_plugin(name: String, app: tauri::AppHandle) -> String {
    let workspace = get_env("workdir".to_string(), app.clone()).await.unwrap();
    let path = format!("{}/.conf/plugins/{}/dist/plugin.js", workspace, name);
    let path = std::path::Path::new(&path);
    std::fs::read_to_string(path).unwrap()
}
