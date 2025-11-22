"""
This is a handy utility for loading our initial data from JSON files into the database.
It's set up to run automatically when the application starts up.
"""

import json
from pathlib import Path
from sqlmodel import Session, select
from .db.models import Temple, Weapon, Fossil
from .core.database import initialize_engine

# We'll get the engine from our main application file (main.py), where it's initialized.
def get_engine():
    return initialize_engine()

DATA_PATH = Path(__file__).parent / "data"

def load_initial_data():
    """
    This function loads the initial data from our JSON files into the database,
    but only if the tables are currently empty.
    """
    
    try:
        engine = get_engine()
        with Session(engine) as session:
            # Let's start with the temples.
            temples_file = DATA_PATH / "temples.json"
            if temples_file.exists():
                # First, we check if there are any temples already in the database.
                existing_temples = session.exec(select(Temple)).first()
                if not existing_temples:
                    print("→ Loading temples data...")
                    with open(temples_file, 'r', encoding='utf-8') as f:
                        temples_data = json.load(f)
                    
                    for temple_data in temples_data:
                        temple = Temple(**temple_data)
                        session.add(temple)
                    session.commit()
                    print(f"  ✓ Loaded {len(temples_data)} temples")
                else:
                    print("  ✓ Temples data already exists (skipped)")
            
            # Now for the weapons.
            weapons_file = DATA_PATH / "weapons.json"
            if weapons_file.exists():
                existing_weapons = session.exec(select(Weapon)).first()
                if not existing_weapons:
                    print("→ Loading weapons data...")
                    with open(weapons_file, 'r', encoding='utf-8') as f:
                        weapons_data = json.load(f)
                    
                    for weapon_data in weapons_data:
                        weapon = Weapon(**weapon_data)
                        session.add(weapon)
                    session.commit()
                    print(f"  ✓ Loaded {len(weapons_data)} weapons")
                else:
                    print("  ✓ Weapons data already exists (skipped)")
            
            # And now, the fossils (replacing animals).
            fossils_file = DATA_PATH / "fossils.json"
            if fossils_file.exists():
                existing_fossils = session.exec(select(Fossil)).first()
                if not existing_fossils:
                    print("→ Loading fossils data...")
                    with open(fossils_file, 'r', encoding='utf-8') as f:
                        fossils_data = json.load(f)
                    
                    for fossil_data in fossils_data:
                        fossil = Fossil(**fossil_data)
                        session.add(fossil)
                    session.commit()
                    print(f"  ✓ Loaded {len(fossils_data)} fossils")
                else:
                    print("  ✓ Fossils data already exists (skipped)")
            
            print("\n✅ Data loading complete!")
    
    except Exception as e:
        print(f"\n❌ ERROR: Failed to load initial data: {e}")
        print("The application will continue, but some data might be missing.")
        # We don't want to crash the app, so we'll just log the error.
