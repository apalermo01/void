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
use base64::{Engine as _, engine::general_purpose};
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

            let mut command = CommandBuilder::new("zsh");
            command.arg("-i");
            command.env("TERM", "xterm-256color");

            let mut child = pair.slave.spawn_command(command).unwrap();
            let mut reader = pair.master.try_clone_reader().unwrap();
            let mut writer = pair.master.take_writer().unwrap();

            let app_clone = app.clone();
            thread::spawn(move || {
                let mut buffer = [0u8; 1024];
                let mut utf8_accumulator = Vec::new();

                loop {
                    let read_len = match reader.read(&mut buffer) {
                        Ok(0) => break,
                        Ok(n) => n,
                        Err(_) => break,
                    };

                    utf8_accumulator.extend_from_slice(&buffer[..read_len]);

                    while !utf8_accumulator.is_empty() {
                        match std::str::from_utf8(&utf8_accumulator) {
                            Ok(valid_str) => {
                                // всё валидно, шлем и выходим
                                let encoded = general_purpose::STANDARD.encode(valid_str);
                                let _ = app_clone.emit("nvim-data", encoded);
                                utf8_accumulator.clear();
                                break;
                            }
                            Err(e) if e.valid_up_to() > 0 => {
                                let (valid, rest) = utf8_accumulator.split_at(e.valid_up_to());
                                let encoded = general_purpose::STANDARD.encode(valid);
                                let _ = app_clone.emit("nvim-data", encoded);
                                utf8_accumulator = rest.to_vec();
                            }
                            Err(_) => break, // ждём ещё байтов
                        }
                    }
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
