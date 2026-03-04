from pydantic_settings import BaseSettings, SettingsConfigDict

import os

from decouple import config

#DB_URL = f"postgresql+asyncpg://{config('POSTGRES_USER')}:{config('POSTGRES_PASSWORD')}@{config('POSTGRES_HOST')}:{config('POSTGRES_PORT')}/{config('POSTGRES_DB')}"


class Settings(BaseSettings):
    DATABASE_URL: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra='ignore',
    )


def get_settings() -> Settings:
    return Settings()

settings = get_settings()
