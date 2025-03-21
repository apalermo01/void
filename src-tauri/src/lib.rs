mod commands;
use commands::*;
use tauri::Manager;
use window_vibrancy::apply_vibrancy;
use window_vibrancy::NSVisualEffectMaterial;
use window_vibrancy::NSVisualEffectState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            apply_vibrancy(
                &window,
                NSVisualEffectMaterial::Titlebar,
                Some(NSVisualEffectState::Active),
                None,
            )
            .unwrap();
            Ok(())
        })
        // .plugin(tauri_plugin_shell::init()) // uncomment to use shell
        .invoke_handler(tauri::generate_handler![set_env, get_env,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
