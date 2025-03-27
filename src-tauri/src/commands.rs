use dotenvy::dotenv;
use std::fs;
mod explorer;
mod settings;
pub use explorer::*;
pub use settings::*;

#[tauri::command]
pub fn get_env(ename: String) -> String {
    dotenv().unwrap();
    let value: String = dotenvy::var(ename).unwrap();
    value
}

#[tauri::command]
pub fn set_env(ename: String, name: String) -> String {
    let file = std::fs::read_to_string("./.env").unwrap();
    let penis: String = format!("{}=\"{}\"", { &ename }, { &name });
    let mut file = file.lines().collect::<Vec<&str>>();
    for i in 0..file.len() {
        if file[i].contains(&ename) {
            file[i] = &penis;
            break;
        }
    }
    fs::write("./.env", file.join("\n")).unwrap();

    name
}
