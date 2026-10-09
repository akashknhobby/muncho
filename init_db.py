#!/usr/bin/env python3
"""
Database table initialization script for Muncho.
Reads database connection details from .env (DATABASE_URL) or accepts parameters,
and executes schema.sql against PostgreSQL.
"""

import os
import sys
from pathlib import Path

# Load .env file manually if python-dotenv is not installed
def load_env(env_path: Path):
    if not env_path.exists():
        return
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            key = key.strip()
            val = val.strip().strip("'\"")
            if key not in os.environ:
                os.environ[key] = val

def main():
    base_dir = Path(__file__).resolve().parent
    env_file = base_dir / ".env"
    schema_file = base_dir / "schema.sql"

    load_env(env_file)

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("Error: DATABASE_URL not found in environment or .env file.", file=sys.stderr)
        sys.exit(1)

    if not schema_file.exists():
        print(f"Error: Schema file not found at {schema_file}", file=sys.stderr)
        sys.exit(1)

    with open(schema_file, "r", encoding="utf-8") as f:
        sql_content = f.read()

    print(f"Connecting to database...")

    try:
        try:
            import psycopg2
        except ImportError:
            # Check venv
            venv_site = base_dir / ".venv" / "lib"
            py_dirs = list(venv_site.glob("python3.*/site-packages"))
            if py_dirs:
                sys.path.insert(0, str(py_dirs[0]))
                import psycopg2
            else:
                raise

        conn = psycopg2.connect(database_url)
        conn.autocommit = True
        with conn.cursor() as cursor:
            cursor.execute(sql_content)
        conn.close()
        print("Successfully executed schema.sql and initialized tables!")

    except ImportError:
        print(
            "Could not import psycopg2. Please install it using:\n"
            "    pip install psycopg2-binary\n"
            "or run the script with .venv/bin/python init_db.py",
            file=sys.stderr,
        )
        sys.exit(1)
    except Exception as e:
        print(f"Error executing schema script: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
