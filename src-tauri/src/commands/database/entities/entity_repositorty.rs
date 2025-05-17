use std::fmt::Debug;

use serde::{Deserialize, Serialize};
use surrealdb::{Surreal, engine::local::Db};

use super::{EntityControl, EntityError};

pub struct DbRepo {
    pub database: Surreal<Db>,
}

impl DbRepo {
    pub fn new(db: Surreal<Db>) -> DbRepo {
        DbRepo { database: db }
    }

    pub async fn create<B, T>(
        &self,
        input: Vec<B>,
        app: tauri::AppHandle,
        db_name: &'static str,
        name: &str,
    ) -> Result<(), EntityError>
    where
        for<'de> T: Deserialize<'de> + Serialize + 'static + EntityControl<B, T>,
    {
        let entity = T::new(input, app)?;
        self.database
            .create::<Option<T>>((db_name, name))
            .content(entity)
            .await
            .unwrap();
        Ok(())
    }

    pub async fn get<T>(&self, name: &str, db_name: &'static str) -> Result<T, EntityError>
    where
        for<'de> T: Deserialize<'de> + 'static,
    {
        let result: Option<T> = self.database.select((db_name, name)).await.unwrap();
        result.ok_or(EntityError::NotFound)
    }

    pub async fn get_all_members<T>(&self, db_name: &'static str) -> Result<Vec<T>, EntityError>
    where
        for<'de> T: Deserialize<'de> + Debug + 'static,
    {
        let result = self.database.select::<Vec<T>>(db_name).await.map_err(|e| {
            println!("{}", e);
            EntityError::NotFound
        })?;
        Ok(result)
    }

    pub async fn update(
        &self,
        name: String,
        db_name: &'static str,
        key: String,
        value: String,
    ) -> Result<(), EntityError> {
        let query = format!("UPDATE type::thing($table, $name) SET {} = $value", key);
        let _ = self
            .database
            .query(query)
            .bind(("table", db_name))
            .bind(("name", name))
            .bind(("value", value))
            .await
            .map_err(|_| EntityError::DbQueryError)?;
        Ok(())
    }

    pub async fn delete(
        &self,
        db_name: &'static str,
        key: &'static str,
        value: String,
    ) -> Result<(), EntityError> {
        if db_name == "main_config" {
            return Err(EntityError::NotAllowed);
        }
        let query = format!("DELETE FROM {} WHERE {} = $value", db_name, key);
        let _ = &self
            .database
            .query(query)
            .bind(("value", value))
            .await
            .map_err(|_| EntityError::DbQueryError)?;
        Ok(())
    }
}
