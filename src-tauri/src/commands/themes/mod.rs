use super::{
    DB, EntityControl, EntityError, MainConfig, SideRepo, SideRepoField, ThemeRepo, ThemeRepoField,
    add_repo, get_env,
};
use rust_fetch::reqwest;
use serde::Deserialize;
use std::{collections::HashMap, fs, vec};
use tauri::Emitter;

#[derive(Deserialize, Debug)]
struct ThemeManifestMember {
    name: String,
    author: String,
    version: String,
}

#[tauri::command]
pub async fn get_theme(name: String, _app: tauri::AppHandle) -> Result<String, String> {
    let config = DB
        .get()
        .unwrap()
        .get::<MainConfig>("singletone", "main_config")
        .await
        .map_err(|e| e.to_string())?;
    let workdir = config
        .get_value_by_key("workdir".to_string())
        .map_err(|e| e.to_string())?;
    let path = format!("{}/.conf/themes/{}/theme.css", workdir, name);
    let path = std::path::Path::new(&path);
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_list_of_themes(
    key: String,
    _app: tauri::AppHandle,
) -> Result<Vec<ThemeRepo>, String> {
    let db = DB.get().unwrap();
    let entities = db
        .get_all_members::<ThemeRepo>("themes_repo")
        .await
        .map_err(|e| e.to_string())?;
    let fentities = match key.as_str() {
        "installed" => entities
            .iter()
            .filter(|t| *t.get_value_by_key("installed".to_string()).unwrap() == "true".to_string())
            .map(|x| x.clone())
            .collect::<Vec<ThemeRepo>>(),
        "not_installed" => entities
            .iter()
            .filter(|t| {
                *t.get_value_by_key("installed".to_string()).unwrap() == "false".to_string()
            })
            .map(|x| x.clone())
            .collect::<Vec<ThemeRepo>>(),
        _ => Vec::<ThemeRepo>::new(),
    };
    Ok(fentities)
}

#[tauri::command]
pub async fn create_themes_table(link: String, app: tauri::AppHandle) {
    let db = DB.get().unwrap();
    add_repo("Theme".to_string(), link.clone(), app.clone()).await;
    let linkparts = link.split('/').collect::<Vec<&str>>();
    let client = reqwest::Client::new();
    let response = client
        .get(format!(
            "https://raw.githubusercontent.com/{}/{}/main/manifest.json",
            linkparts.get(1).unwrap(),
            linkparts.get(2).unwrap()
        ))
        .send()
        .await;
    let manifest = match response {
        Ok(r) => r.text().await.unwrap(),
        _ => "none".to_string(),
    };
    let themes = serde_json::from_str::<HashMap<String, ThemeManifestMember>>(&manifest).unwrap();
    for (key, theme) in themes.into_iter() {
        let link = format!(
            "https://raw.githubusercontent.com/{}/{}/main/{}/theme.css",
            linkparts.get(1).unwrap(),
            linkparts.get(2).unwrap(),
            key
        );
        println!("{}", link);
        let input: Vec<ThemeRepoField> = vec![
            ThemeRepoField::Name(theme.name.clone()),
            ThemeRepoField::Author(theme.author.clone()),
            ThemeRepoField::Version(theme.version.clone()),
            ThemeRepoField::Link(link),
            ThemeRepoField::Installed("false".to_string()),
        ];
        db.create::<ThemeRepoField, ThemeRepo>(input, app.clone(), "themes_repo", &key)
            .await
            .unwrap();
    }
}

#[tauri::command]
pub async fn clone_theme(key: String, app: tauri::AppHandle) -> Result<(), String> {
    let db = DB.get().unwrap();
    let themes_list = db
        .get_all_members::<ThemeRepo>("themes_repo")
        .await
        .map_err(|e| e.to_string())?;
    let mut selected_theme: Option<ThemeRepo> = None;
    let workdir = get_env("workdir".to_string(), app.clone()).await.unwrap();
    for theme in themes_list {
        if theme
            .get_value_by_key("name".to_string())
            .map_err(|e| e.to_string())?
            == key
        {
            selected_theme = Some(theme);
        }
    }
    match selected_theme {
        Some(theme) => {
            let client = reqwest::Client::new();
            let theme_css = client
                .get(theme.get_value_by_key("link".to_string()).unwrap())
                .send()
                .await
                .map_err(|e| e.to_string())?;
            db.update(
                key.clone(),
                "themes_repo",
                "is_installed".to_string(),
                "true".to_string(),
            )
            .await
            .map_err(|e| e.to_string())?;
            let theme_css = theme_css.text().await.map_err(|e| e.to_string())?;
            let theme_dir = format!("{}/.conf/themes/{}", workdir, key.clone());
            let theme_dir_path = std::path::Path::new(&theme_dir);
            let theme_file = format!("{}/theme.css", theme_dir);
            let theme_file_path = std::path::Path::new(&theme_file);
            fs::create_dir(theme_dir_path).map_err(|e| e.to_string())?;
            fs::write(theme_file_path, theme_css).map_err(|e| e.to_string())?;
        }
        None => return Err(EntityError::NotFound.to_string()),
    }
    app.emit("theme_downloaded", key).unwrap();
    Ok(())
}

#[tauri::command]
pub async fn check_theme_update(theme_name: String, app: tauri::AppHandle) -> Result<(), String> {
    let db = DB.get().unwrap();
    let theme = db
        .get::<ThemeRepo>(&theme_name, "themes_repo")
        .await
        .map_err(|e| e.to_string())?;
    let fetch_client = reqwest::Client::new();
    let css = fetch_client
        .get(theme.get_value_by_key("link".to_string()).unwrap())
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();
    let prev_theme = get_theme(theme_name.clone(), app.clone()).await.unwrap();
    if prev_theme != css {
        let sp = format!(
            "{}/.conf/themes/{}/theme.css",
            get_env("workdir".to_string(), app.clone()).await.unwrap(),
            theme_name
        );
        let theme_path = std::path::Path::new(&sp);
        std::fs::write(theme_path, css).unwrap();
    } else {
        app.emit("notify", "Установлена последняя версия темы")
            .unwrap();
    }
    Ok(())
}

#[tauri::command]
pub async fn delete_theme(theme_name: String, app: tauri::AppHandle) -> Result<(), String> {
    let db = DB.get().unwrap();
    let workdir = get_env("workdir".to_string(), app.clone()).await?;
    let theme_dir = format!("{}/.conf/themes/{}", workdir, theme_name);
    let path = std::path::Path::new(&theme_dir);
    std::fs::remove_dir_all(path).map_err(|e| e.to_string())?;
    db.update(
        theme_name,
        "themes_repo",
        "is_installed".to_string(),
        "false".to_string(),
    )
    .await
    .map_err(|e| e.to_string())?;
    app.emit("theme_changed", "").unwrap();
    Ok(())
}
