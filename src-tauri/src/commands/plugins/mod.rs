use rust_fetch::reqwest;
use serde::Deserialize;
use tauri::Emitter;

use super::{DB, EntityControl, PluginList, PluginListFields, add_repo};

#[derive(Deserialize)]
struct PluginManifest {
    #[allow(dead_code)]
    repo_type: String,
    members: Vec<PluginManifestMember>,
}
#[derive(Deserialize)]
struct PluginManifestMember {
    name: String,
    author: String,
    version: String,
    plugin_type: String,
}

#[tauri::command]
pub async fn create_plugins_table(url: String, app: tauri::AppHandle) -> Result<(), String> {
    let db = DB.get().unwrap();
    let linkparts = url.split("/").collect::<Vec<_>>();
    add_repo("Plugins".to_string(), url.clone(), app.clone()).await;
    let client = reqwest::Client::new();
    let manifest = client
        .get(format!(
            "https://raw.githubusercontent.com/{}/{}/main/manifest.json",
            linkparts.get(1).unwrap(),
            linkparts.get(2).unwrap()
        ))
        .send()
        .await;
    let manifest = match manifest {
        Ok(s) => s.text().await.unwrap(),
        Err(e) => {
            app.emit("error", e.to_string()).unwrap();
            "none".to_string()
        }
    };
    let object = serde_json::from_str::<PluginManifest>(&manifest).unwrap();
    for plugin in object.members.into_iter() {
        let item = vec![
            PluginListFields::Name(plugin.name.clone()),
            PluginListFields::Author(plugin.author),
            PluginListFields::Version(plugin.version),
            PluginListFields::PluginType(plugin.plugin_type),
            PluginListFields::Installed("false".to_string()),
        ];
        db.create::<PluginListFields, PluginList>(
            item,
            app.clone(),
            "plugins_repo",
            plugin.name.as_str(),
        )
        .await
        .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn get_list_of_plugins(key: String) -> Result<Vec<PluginList>, String> {
    let db = DB.get().unwrap();
    let result = match key.as_str() {
        "installed" => db
            .get_all_members::<PluginList>("plugins_repo")
            .await
            .map_err(|e| e.to_string())?
            .iter()
            .filter(|e| {
                e.get_value_by_key("is_intalled".to_string())
                    .unwrap()
                    .as_str()
                    != "false"
            })
            .cloned()
            .collect::<Vec<_>>(),
        "not_installed" => db
            .get_all_members::<PluginList>("plugins_table")
            .await
            .map_err(|e| e.to_string())?
            .iter()
            .filter(|p| {
                p.get_value_by_key("is_installed".to_string())
                    .unwrap()
                    .as_str()
                    == "false"
            })
            .cloned()
            .collect::<Vec<_>>(),
        _ => Vec::<PluginList>::new(),
    };
    Ok(result)
}
