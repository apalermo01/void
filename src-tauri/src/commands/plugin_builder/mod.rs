use crate::import_dotenv;
use dotenvy::{self, dotenv};

#[tauri::command]
pub fn build_plugin(plug_name: String) {
    let result: String = import_dotenv!("WORKDIR");
    println!("{}", result)
}
