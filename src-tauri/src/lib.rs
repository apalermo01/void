mod commands;
use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(PtyState::default())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_env,
            set_env,
            get_entry_list,
            get_settings_list,
            get_file,
            open_neovim,
            resize_neovim,
            send_to_neovim
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
