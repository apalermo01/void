use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use tauri::{AppHandle, Emitter, Manager, Window};

#[tauri::command]
pub fn open_neovim(app: AppHandle) {
    // Запускаем neovim в режиме терминала
    let mut child = Command::new("nvim")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("Failed to start neovim");

    let stdout = child.stdout.take().unwrap();
    let reader = BufReader::new(stdout);

    std::thread::spawn(move || {
        for line in reader.lines() {
            if let Ok(line) = line {
                let _ = window.emit("terminal-data", line);
            }
        }
    });

    let _ = window.emit("terminal-data", "Neovim запущен 🚀");
}
