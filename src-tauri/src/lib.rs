mod commands;
use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        // .plugin(tauri_plugin_shell::init()) // uncomment to use shell
        .invoke_handler(tauri::generate_handler![
            set_env,
            get_env,
            get_settings_list,
            get_entry_list
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
