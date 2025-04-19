use portable_pty::{CommandBuilder, PtySize, native_pty_system};
use std::io::{Read, Write};
use std::sync::Mutex;
use std::sync::mpsc::{self, Sender};
use std::thread;
use tauri::{AppHandle, Emitter, State};

#[derive(Default)]
pub struct PtyState(Mutex<Option<PtyController>>);

pub enum PtyCommand {
    Write(String),
    Resize(u16, u16),
    #[allow(dead_code)]
    Stop,
}

pub struct PtyController {
    pub tx: Sender<PtyCommand>,
}

impl PtyController {
    pub fn start(app: AppHandle, cols: u16, rows: u16) -> Self {
        let (tx, rx) = mpsc::channel::<PtyCommand>();

        thread::spawn(move || {
            let pty_system = native_pty_system();
            let pair = pty_system
                .openpty(PtySize {
                    rows,
                    cols,
                    pixel_width: 0,
                    pixel_height: 0,
                })
                .unwrap();

            let mut child = pair
                .slave
                .spawn_command(CommandBuilder::new("nvim"))
                .unwrap();
            let mut reader = pair.master.try_clone_reader().unwrap();
            let mut writer = pair.master.take_writer().unwrap();

            let app_clone = app.clone();
            thread::spawn(move || {
                let mut buffer = [0u8; 1024];
                while let Ok(n) = reader.read(&mut buffer) {
                    if n == 0 {
                        break;
                    }
                    let output = String::from_utf8_lossy(&buffer[..n]).to_string();
                    let _ = app_clone.emit("nvim-data", output);
                }
            });

            for cmd in rx {
                match cmd {
                    PtyCommand::Write(data) => {
                        let _ = writer.write_all(data.as_bytes());
                    }
                    PtyCommand::Resize(cols, rows) => {
                        let _ = pair.master.resize(PtySize {
                            rows,
                            cols,
                            pixel_width: 0,
                            pixel_height: 0,
                        });
                    }
                    PtyCommand::Stop => {
                        break;
                    }
                }
            }

            let _ = child.kill();
        });

        Self { tx }
    }
}

#[tauri::command]
pub fn open_neovim(app: AppHandle, state: State<PtyState>, cols: u16, rows: u16) {
    let controller = PtyController::start(app, cols, rows);
    let mut lock = state.0.lock().unwrap();
    *lock = Some(controller);
}

#[tauri::command]
pub fn resize_neovim(rows: u16, cols: u16, state: State<PtyState>) {
    if let Some(ctrl) = &*state.0.lock().unwrap() {
        let _ = ctrl.tx.send(PtyCommand::Resize(cols, rows));
    }
}

#[tauri::command]
pub fn send_to_neovim(line: String, state: State<PtyState>) {
    if let Some(ctrl) = &*state.0.lock().unwrap() {
        let _ = ctrl.tx.send(PtyCommand::Write(line));
    }
}
