from pydantic_settings import BaseSettings, SettingsConfigDict


def normalize_database_url(url: str) -> str:
    # Render provides postgres:// but SQLAlchemy + psycopg2 expects postgresql://
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://inventory:inventory@db:5432/inventory_db"
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://localhost"
    low_stock_threshold: int = 10

    @property
    def sqlalchemy_database_url(self) -> str:
        return normalize_database_url(self.database_url)


settings = Settings()
