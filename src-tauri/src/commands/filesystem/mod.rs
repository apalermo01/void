use std::{fs, path::Path};

use crate::MAIN_FOLDER_PREFIX;

#[tauri::command]
pub fn get_file(ipath: String) -> Vec<u8> {
    let fpath: &Path = Path::new(&ipath);
    fs::read(fpath).unwrap()
}

#[tauri::command]
pub async fn setup_config_directory(app: tauri::AppHandle) -> Result<(), String> {
    let workdir_conf = super::get_env("workdir".to_string(), app.clone())
        .await
        .unwrap()
        + "/.conf";
    let plugins_conf = workdir_conf.clone() + "/plugins";
    let themes_conf = workdir_conf + "/themes";
    let themes_path = Path::new(&themes_conf);
    let plugins_path = Path::new(&plugins_conf);
    fs::create_dir_all(themes_path).unwrap();
    fs::create_dir_all(plugins_path).unwrap();
    let dest = super::get_env("workdir".to_string(), app).await.unwrap() + "/profile.png";
    let dest_path = Path::new(&dest);
    let value = fs::copy(
        format!("{}Resources/profile.png", MAIN_FOLDER_PREFIX),
        dest_path,
    )
    .unwrap();
    println!("{}", value);
    Ok(())
}
