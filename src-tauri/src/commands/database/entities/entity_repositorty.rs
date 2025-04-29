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
        name: &'static str,
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

    pub async fn get<T>(&self, name: &'static str, db_name: &'static str) -> Result<T, EntityError>
    where
        for<'de> T: Deserialize<'de> + 'static,
    {
        let result: Option<T> = self.database.select((db_name, name)).await.unwrap();
        result.ok_or(EntityError::NotFound)
    }

    pub async fn update(
        &self,
        name: &'static str,
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
            .map_err(|_| EntityError::DbQueryError);
        Ok(())
    }

    pub async fn delete(
        &self,
        db_name: &'static str,
        name: &'static str,
    ) -> Result<(), EntityError> {
        if db_name == "main_config" {
            return Err(EntityError::NotAllowed);
        }
        let _ = &self
            .database
            .query("DELETE FROM $table WHERE name = $name")
            .bind(("table", db_name))
            .bind(("name", name))
            .await
            .map_err(|_| EntityError::DbQueryError)?;
        Ok(())
    }
}
