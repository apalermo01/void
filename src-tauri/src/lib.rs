mod commands;
use commands::*;

const MAIN_FOLDER_PREFIX: &str = "../../";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            tauri::async_runtime::block_on(async {
                if let Err(e) = create_first_database(app.handle().clone()).await {
                    eprintln!("Ошибка при инициализации{}", e);
                }
            });
            Ok(())
        })
        .manage(PtyState::default())
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
            get_directory_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
