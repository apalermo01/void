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
