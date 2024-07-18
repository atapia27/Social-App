import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Important: Add the path to the system path.
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from database import Base, engine  # Adjust imports as necessary
from models import User, Video, Comment  # Ensure models are imported

# Alembic Config object, provides access to values within the .ini file in use.
config = context.config
fileConfig(config.config_file_name)
target_metadata = Base.metadata


def run_migrations_online():
    """Run migrations in 'online' mode."""

    def process_revision_directives(context, revision, directives):
        if config.cmd_opts.autogenerate:
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                print("No changes in schema detected.")

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        url=os.environ.get("DATABASE_URL"),
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            process_revision_directives=process_revision_directives,
            # Remove any Flask-specific configurations
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


run_migrations_online()
