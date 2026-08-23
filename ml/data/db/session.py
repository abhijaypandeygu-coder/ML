import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Use environment variable for Postgres, fallback to local SQLite for development
# Example Postgres URL: postgresql://user:password@localhost:5432/freightquant
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./freightquant.db")

engine = create_engine(
    DATABASE_URL,
    # SQLite requires connect_args for multithreading, Postgres ignores this
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
