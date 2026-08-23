import os
import sys

# Ensure ml module is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))

from ml.data.db.session import engine, Base
from ml.data.db.models import FreightRate, Port, Vessel

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

if __name__ == "__main__":
    init_db()
