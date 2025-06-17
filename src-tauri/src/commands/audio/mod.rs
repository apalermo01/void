use lofty::{self, file::TaggedFileExt};
use serde::Serialize;

#[derive(Serialize)]
pub struct AudioMeta {
    picture: Vec<u8>,
    title: String,
    author: String,
}

#[tauri::command]
pub fn read_audio_metadata(path: String) -> Result<AudioMeta, String> {
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
    let author = primary
        .get_string(&lofty::tag::ItemKey::TrackArtist)
        .ok_or("нету исполнителя".to_string())?;
    let title = primary
        .get_string(&lofty::tag::ItemKey::TrackTitle)
        .ok_or("нет названия".to_string())?;
    let meta = AudioMeta {
        picture: file,
        title: title.to_string(),
        author: author.to_string(),
    };
    Ok(meta)
}
