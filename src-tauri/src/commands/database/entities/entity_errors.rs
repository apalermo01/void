use thiserror::Error;

#[derive(Error, Debug)]
pub enum EntityError {
    #[error("Ошибка инициализации поля`{0}`")]
    InvalidField(&'static str),

    #[error("Неправильное количество вводных")]
    WrongInputLength,

    #[error("Ошибка при исполнении Query")]
    DbQueryError,

    #[error("Запись не найдена в бд")]
    NotFound,

    #[error("Нельзя удалить основную конфигурацию")]
    NotAllowed,
}
