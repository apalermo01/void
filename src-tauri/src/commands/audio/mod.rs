use lofty::{self, file::TaggedFileExt};

#[tauri::command]
pub fn read_audio_metadata(path: String) -> Result<Vec<u8>, String> {
    let path = std::path::Path::new(&path);
    let tags = lofty::probe::Probe::open(path)
        .map_err(|e| e.to_string())?
        .guess_file_type()
        .map_err(|e| e.to_string())?
        .read()
        .map_err(|e| e.to_string())?;
    let primary = tags.primary_tag().ok_or("нету метадаты".to_string())?;
    let picture = primary.pictures().first().ok_or("нету фото".to_string())?;
    let file = picture.data().to_vec();
    Ok(file)
}
