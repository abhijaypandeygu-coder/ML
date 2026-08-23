from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FreightQuant Backend"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./freightquant.db"
    
    # Optional integration settings
    DATA_PROVIDER_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
