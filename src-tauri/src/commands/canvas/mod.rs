use tauri::Emitter;

#[tauri::command]
pub async fn write_canvas_data(
    path: String,
    data: String,
    app: tauri::AppHandle,
) -> Result<String, String> {
    let workdir = super::get_env("workdir".to_string(), app.clone())
        .await
        .unwrap();
    let mut path = path;
    if path.is_empty() {
        let canvas_collection = super::get_directory_content("".to_string(), app.clone()).await;
        let index = canvas_collection
            .iter()
            .filter(|dir| dir.contains(".canvas"))
            .collect::<Vec<_>>()
            .len()
            + 1;
        path = format!("/untitled{}.canvas", index);
    }
    let path = workdir + path.as_str();
    let path = std::path::Path::new(&path);
    println!("{:#?}", path);
    std::fs::write(path, data.as_str()).map_err(|e| {
        app.emit("error", e.to_string()).unwrap();
        e.to_string()
    })?;
    Ok(path
        .to_str()
        .unwrap()
        .split("/")
        .last()
        .unwrap()
        .to_string())
}
