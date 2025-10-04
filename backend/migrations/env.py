from logging.config import fileConfig
import os
import sys

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- MODIFICATION 1: ADD PROJECT DIRECTORY TO PYTHON PATH ---
# This allows the script to find your 'app' module and models
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# -----------------------------------------------------------


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# --- MODIFICATION 2: LOAD .ENV AND GET THE DATABASE URL ---
# This is the crucial part that fixes the "username" error.
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL environment variable is not set. Please check your .env file.")
# -----------------------------------------------------------


# --- MODIFICATION 3: SET TARGET METADATA FOR AUTOGENERATE ---
# Add your model's MetaData object here for 'autogenerate' support.
# This tells Alembic what your tables should look like.
# It assumes your SQLAlchemy Base is in 'app.db.base_class'
# Adjust the import if your Base is located elsewhere.
from app.core.database import Base
target_metadata = Base.metadata
# -------------------------------------------------------------


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    context.configure(
        url=DATABASE_URL,  # Use the URL from .env
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    
    # Create a configuration dictionary and set the URL from our .env variable
    configuration = config.get_section(config.config_ini_section)
    configuration['sqlalchemy.url'] = DATABASE_URL

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
