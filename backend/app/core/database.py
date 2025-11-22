from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os
import pymysql
import sys

# Database configuration - supports both local and Railway MySQL
MYSQL_USER = os.getenv("MYSQL_USER", os.getenv("MYSQLUSER", "root"))
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", os.getenv("MYSQLPASSWORD", "root"))
MYSQL_HOST = os.getenv("MYSQL_HOST", os.getenv("MYSQLHOST", "localhost"))
MYSQL_PORT = os.getenv("MYSQL_PORT", os.getenv("MYSQLPORT", "3306"))
DATABASE_NAME = os.getenv("MYSQL_DATABASE", os.getenv("MYSQLDATABASE", "temple_museum"))

# Railway provides DATABASE_URL directly, use it if available
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{DATABASE_NAME}"
)

# We'll keep the database engine as a global variable so it can be shared.
engine = None

def create_database_if_not_exists():
    """
    This function checks if our MySQL database exists, and if not, it creates it.
    It's designed to run before we establish a connection with the database engine.
    """
    try:
        print(f"\n{'='*80}")
        print("Checking MySQL Database Setup...")
        print(f"{'='*80}")
        
        # First, we connect to the MySQL server without specifying a database.
        connection = pymysql.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            port=int(MYSQL_PORT),
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        print(f"✓ Connected to MySQL server at {MYSQL_HOST}:{MYSQL_PORT}")
        
        with connection.cursor() as cursor:
            # Let's see if the database is already there.
            cursor.execute(f"SHOW DATABASES LIKE '{DATABASE_NAME}'")
            result = cursor.fetchone()
            
            if result:
                print(f"✓ Database '{DATABASE_NAME}' already exists")
            else:
                # If not, we'll create it.
                print(f"→ Creating database '{DATABASE_NAME}'...")
                cursor.execute(
                    f"CREATE DATABASE {DATABASE_NAME} "
                    f"CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                )
                connection.commit()
                print(f"✓ Database '{DATABASE_NAME}' created successfully!")
        
        connection.close()
        print(f"{'='*80}\n")
        return True
        
    except pymysql.err.OperationalError as e:
        print(f"\n{'='*80}")
        print("❌ ERROR: Cannot connect to MySQL server!")
        print(f"{'='*80}")
        print(f"Error: {e}")
        print("\nPlease check:")
        print(f"  1. Is MySQL running on {MYSQL_HOST}:{MYSQL_PORT}?")
        print(f"  2. Are the username '{MYSQL_USER}' and password '{MYSQL_PASSWORD}' correct?")
        print("  3. Has the MySQL service been started?")
        print("\nTo start MySQL:")
        print("  - On Windows: Go to Services → MySQL80 → Start")
        print("  - Or, you can use MySQL Workbench.")
        print(f"{'='*80}\n")
        sys.exit(1)
        
    except Exception as e:
        print(f"\n❌ An unexpected error occurred while creating the database: {e}")
        sys.exit(1)

def initialize_engine():
    """Initializes the database engine after making sure the database exists."""
    global engine
    
    if engine is None:
        # First things first, let's make sure the database is ready.
        create_database_if_not_exists()
        
        # Now we can create the engine that connects to our database.
        print("Initializing database engine...")
        engine = create_engine(
            DATABASE_URL,
            echo=False,  # Set this to True if you want to see the SQL queries.
            pool_pre_ping=True,
            pool_recycle=3600,
            pool_size=5,
            max_overflow=10
        )
        print("✓ Database engine initialized\n")
    
    return engine

def create_db_and_tables():
    """This function creates all the necessary database tables."""
    global engine
    
    # We need to make sure the engine is initialized before we can create tables.
    if engine is None:
        initialize_engine()
    
    print("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    print("✓ All tables created successfully!")

def get_session() -> Generator[Session, None, None]:
    """This is a dependency that provides a database session for our API endpoints."""
    global engine
    
    # Again, let's ensure the engine is ready to go.
    if engine is None:
        initialize_engine()
    
    with Session(engine) as session:
        yield session
