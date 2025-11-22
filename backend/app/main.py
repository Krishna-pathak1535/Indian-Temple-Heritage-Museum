from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

# Let's get our environment variables, like database passwords, from the .env file.
load_dotenv()

from .api.auth import router as auth_router
from .api.user import router as user_router
from .api.content import router as content_router
from .api.fossils import router as fossils_router
from .api.admin import router as admin_router
from .api.feedback import router as feedback_router
from .api.gamification import router as gamification_router
from .core.database import create_db_and_tables, initialize_engine
from .data_loader import load_initial_data

app = FastAPI(
    title="Indian Temple Heritage Museum API",
    description="An immersive 3D virtual museum showcasing India's rich temple heritage",
    version="1.0.0"
)

# This function runs once when the server starts up. It's the perfect place to get everything ready.
@app.on_event("startup")
def on_startup():
    print("\n" + "="*80)
    print("🕉️  INDIAN TEMPLE HERITAGE MUSEUM - STARTING UP 🕉️")
    print("="*80 + "\n")
    
    # First, we'll connect to the database. If the database doesn't exist, it will be created automatically.
    print("Step 1: Initializing Database Connection")
    print("-" * 80)
    initialize_engine()
    
    # Now, let's create the tables for our users, temples, etc.
    print("\nStep 2: Creating Database Tables")
    print("-" * 80)
    create_db_and_tables()
    
    # Time to fill our museum! Let's load all the temple, weapon, and fossil data from our JSON files.
    print("\nStep 3: Loading Initial Data from JSON Files")
    print("-" * 80)
    load_initial_data()
    
    print("\n" + "="*80)
    print("✅ APPLICATION STARTUP COMPLETE!")
    print("="*80)
    print("\n📍 Access Points:")
    print("   → Frontend: http://localhost:5173")
    print("   → Backend API: http://localhost:8000")
    print("   → API Docs: http://localhost:8000/docs")
    print("\n" + "="*80 + "\n")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Our Vite frontend runs here
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# This makes our images and audio files available to the frontend.
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(content_router)
app.include_router(fossils_router)
app.include_router(admin_router)
app.include_router(feedback_router)
app.include_router(gamification_router)

@app.get("/")
def read_root():
    return {"message": "Indian Temple Heritage Museum API - MySQL Edition"}
