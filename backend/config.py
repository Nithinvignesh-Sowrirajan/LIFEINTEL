"""
LIFEINTEL Backend — Configuration
Environment-based settings with sensible defaults.
"""

import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "LIFEINTEL"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = ""
    DATABASE_DIR: str = ""

    # File storage
    UPLOAD_DIR: str = ""
    MAX_UPLOAD_SIZE_MB: int = 50
    ALLOWED_EXTENSIONS: str = ".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp"

    # AI/ML (Phase 3+)
    AI_PROVIDER: str = "local"  # "local" or "cloud"
    LOCAL_MODEL_NAME: str = "llama3"
    OLLAMA_BASE_URL: str = "http://127.0.0.1:11434"

    # Monitoring
    MONITORING_INTERVAL_SECONDS: int = 300  # 5 minutes
    MAX_CONCURRENT_PROCESSING: int = 2

    # Security
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    model_config = {"env_prefix": "LIFEINTEL_", "env_file": ".env", "extra": "ignore"}

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Set default paths relative to the backend directory
        backend_dir = Path(__file__).parent
        project_dir = backend_dir.parent

        if not self.DATABASE_DIR:
            self.DATABASE_DIR = str(project_dir / "data")
        if not self.DATABASE_URL:
            db_path = Path(self.DATABASE_DIR) / "lifeintel.db"
            self.DATABASE_URL = f"sqlite:///{db_path}"
        if not self.UPLOAD_DIR:
            self.UPLOAD_DIR = str(project_dir / "data" / "uploads")

        # Ensure directories exist
        Path(self.DATABASE_DIR).mkdir(parents=True, exist_ok=True)
        Path(self.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

    @property
    def allowed_extensions_list(self) -> list[str]:
        return [ext.strip() for ext in self.ALLOWED_EXTENSIONS.split(",")]

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
