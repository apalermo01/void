#[tauri::command]
pub fn get_note_content(path: String) -> Result<String, String> {
    let path = std::path::Path::new(&path);
    let content = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
    Ok(content)
}
