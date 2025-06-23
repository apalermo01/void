mod commands;
use commands::*;
use tauri_plugin_fs::FsExt;

#[cfg(target_os = "macos")]
const MAIN_FOLDER_PREFIX: &str = "../../";

#[cfg(target_os = "windows")]
const MAIN_FOLDER_PREFIX: &str = "../../";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let video_state = init_video_server();

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            tauri::async_runtime::block_on(async {
                if let Err(e) = create_first_database(app.handle().clone()).await {
                    eprintln!("Ошибка при инициализации{}", e);
                }
                if get_env("workdir".to_string(), app.handle().clone())
                    .await
                    .unwrap()
                    .as_str()
                    != ""
                {
                    let scope = app.fs_scope();
                    let _ = scope.allow_directory(
                        get_env("workdir".to_string(), app.handle().clone())
                            .await
                            .unwrap(),
                        true,
                    );
                }
            });
            Ok(())
        })
        .manage(PtyState::default())
        .manage(video_state)
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_env,
            set_env,
            get_settings_list,
            get_file,
            open_neovim,
            resize_neovim,
            send_to_neovim,
            create_first_database,
            get_theme,
            get_list_of_themes,
            read_plugin,
            create_themes_table,
            clone_theme,
            add_repo,
            get_repos_list,
            delete_repo,
            check_theme_update,
            delete_theme,
            get_directory_content,
            create_entry,
            remove,
            setup_config_directory,
            allow_scope,
            read_audio_metadata,
            get_video_url,
            set_video_path,
            check_file_exists,
            get_note_content,
            rename,
            write_canvas_data,
            modify_entry
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
