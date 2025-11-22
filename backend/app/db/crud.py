from sqlmodel import Session, select
from typing import List, Optional
from ..db.models import User, Temple, Weapon, Fossil, Visit, HighScore, Feedback
from ..core.security import hash_password, verify_password
import json
import os
from pathlib import Path

# ===============================================
# JSON Sync Helper Functions
# ===============================================

def get_data_dir():
    """Get the path to the data directory."""
    return Path(__file__).parent.parent / "data"

def sync_temples_to_json(session: Session):
    """Sync all temples from database to temples.json file."""
    try:
        temples = get_all_temples(session)
        data_dir = get_data_dir()
        json_path = data_dir / "temples.json"
        
        temples_data = []
        for temple in temples:
            temples_data.append({
                "id": temple.id,
                "name": temple.name,
                "dynasty": temple.dynasty,
                "builder": temple.builder,
                "time_period": temple.time_period,
                "historical_significance": temple.historical_significance,
                "weapon_used": temple.weapon_used,
                "static_image_url": temple.static_image_url,
                "model_3d_embed": temple.model_3d_embed,
                "audio_story_url": temple.audio_story_url
            })
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(temples_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Synced {len(temples_data)} temples to JSON")
    except Exception as e:
        print(f"❌ Failed to sync temples to JSON: {e}")

def sync_weapons_to_json(session: Session):
    """Sync all weapons from database to weapons.json file."""
    try:
        weapons = get_all_weapons(session)
        data_dir = get_data_dir()
        json_path = data_dir / "weapons.json"
        
        weapons_data = []
        for weapon in weapons:
            weapons_data.append({
                "id": weapon.id,
                "name": weapon.name,
                "dynasty_context": weapon.dynasty_context,
                "type": weapon.type,
                "description": weapon.description,
                "image_url": weapon.image_url,
                "model_3d_embed": weapon.model_3d_embed,
                "audio_story_url": weapon.audio_story_url
            })
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(weapons_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Synced {len(weapons_data)} weapons to JSON")
    except Exception as e:
        print(f"❌ Failed to sync weapons to JSON: {e}")

def sync_fossils_to_json(session: Session):
    """Sync all fossils from database to animals.json file."""
    try:
        fossils = get_all_fossils(session)
        data_dir = get_data_dir()
        json_path = data_dir / "animals.json"
        
        fossils_data = []
        for fossil in fossils:
            fossils_data.append({
                "id": fossil.id,
                "name": fossil.name,
                "fossil_type": fossil.fossil_type,
                "era": fossil.era,
                "age_in_years": fossil.age_in_years,
                "description": fossil.description,
                "origin_location": fossil.origin_location,
                "image_url": fossil.image_url,
                "model_3d_embed": fossil.model_3d_embed,
                "audio_story_url": fossil.audio_story_url
            })
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(fossils_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Synced {len(fossils_data)} fossils to JSON")
    except Exception as e:
        print(f"❌ Failed to sync fossils to JSON: {e}")

# ===============================================
# User CRUD Operations
# ===============================================

def get_user_by_email(session: Session, email: str) -> Optional[User]:
    """
    Finds a user by their email address, ignoring case.
    For example, "user@example.com" and "USER@EXAMPLE.COM" will be treated as the same.
    """
    # We'll normalize the email to lowercase to ensure our search is consistent.
    normalized_email = email.lower().strip()
    
    # Now, we'll look for an exact match on the normalized email.
    statement = select(User).where(User.email == normalized_email)
    return session.exec(statement).first()

def create_user(session: Session, email: str, password: str) -> User:
    """
    Creates a new user with a normalized email address.
    We store all emails in lowercase to keep things tidy.
    """
    # Let's normalize the email before we save it.
    normalized_email = email.lower().strip()
    
    hashed = hash_password(password)
    user = User(email=normalized_email, hashed_password=hashed)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    """Checks if a user's email and password are correct."""
    user = get_user_by_email(session, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# ===============================================
# Temple CRUD Operations
# ===============================================

def get_all_temples(session: Session) -> List[Temple]:
    """Retrieves all temples, sorted by dynasty."""
    statement = select(Temple).order_by(Temple.dynasty)
    return list(session.exec(statement).all())

def get_temple_by_id(session: Session, temple_id: int) -> Optional[Temple]:
    """Finds a single temple by its ID."""
    return session.get(Temple, temple_id)

def create_temple(session: Session, temple_data: dict) -> Temple:
    """Adds a new temple to the database."""
    temple = Temple(**temple_data)
    session.add(temple)
    session.commit()
    session.refresh(temple)
    sync_temples_to_json(session)
    return temple

def update_temple(session: Session, temple_id: int, temple_data: dict) -> Optional[Temple]:
    """Updates an existing temple."""
    temple = session.get(Temple, temple_id)
    if not temple:
        return None
    for key, value in temple_data.items():
        setattr(temple, key, value)
    session.add(temple)
    session.commit()
    session.refresh(temple)
    sync_temples_to_json(session)
    return temple

def delete_temple(session: Session, temple_id: int) -> bool:
    """Deletes a temple from the database."""
    temple = session.get(Temple, temple_id)
    if not temple:
        return False
    session.delete(temple)
    session.commit()
    sync_temples_to_json(session)
    return True

# ===============================================
# Weapon CRUD Operations
# ===============================================

def get_all_weapons(session: Session) -> List[Weapon]:
    """Gets all weapons, sorted by name."""
    statement = select(Weapon).order_by(Weapon.name)
    return list(session.exec(statement).all())

def get_weapon_by_id(session: Session, weapon_id: int) -> Optional[Weapon]:
    """Finds a single weapon by its ID."""
    return session.get(Weapon, weapon_id)

def create_weapon(session: Session, weapon_data: dict) -> Weapon:
    """Adds a new weapon to the database."""
    weapon = Weapon(**weapon_data)
    session.add(weapon)
    session.commit()
    session.refresh(weapon)
    sync_weapons_to_json(session)
    return weapon

def update_weapon(session: Session, weapon_id: int, weapon_data: dict) -> Optional[Weapon]:
    """Updates an existing weapon."""
    weapon = session.get(Weapon, weapon_id)
    if not weapon:
        return None
    for key, value in weapon_data.items():
        setattr(weapon, key, value)
    session.add(weapon)
    session.commit()
    session.refresh(weapon)
    sync_weapons_to_json(session)
    return weapon

def delete_weapon(session: Session, weapon_id: int) -> bool:
    """Deletes a weapon from the database."""
    weapon = session.get(Weapon, weapon_id)
    if not weapon:
        return False
    session.delete(weapon)
    session.commit()
    sync_weapons_to_json(session)
    return True

# ===============================================
# Fossil CRUD Operations
# ===============================================

def get_all_fossils(session: Session) -> List[Fossil]:
    """Retrieves all fossils, sorted by era."""
    statement = select(Fossil).order_by(Fossil.era)
    return list(session.exec(statement).all())

def get_fossil_by_id(session: Session, fossil_id: int) -> Optional[Fossil]:
    """Finds a single fossil by its ID."""
    return session.get(Fossil, fossil_id)

def create_fossil(session: Session, fossil_data: dict, user_id: int) -> Fossil:
    """Adds a new fossil to the database."""
    fossil = Fossil(**fossil_data, updated_by=user_id)
    session.add(fossil)
    session.commit()
    session.refresh(fossil)
    sync_fossils_to_json(session)
    return fossil

def update_fossil(session: Session, fossil_id: int, fossil_data: dict, user_id: int) -> Optional[Fossil]:
    """Updates an existing fossil."""
    fossil = session.get(Fossil, fossil_id)
    if not fossil:
        return None
    for key, value in fossil_data.items():
        setattr(fossil, key, value)
    setattr(fossil, "updated_by", user_id)
    session.add(fossil)
    session.commit()
    session.refresh(fossil)
    sync_fossils_to_json(session)
    return fossil

def delete_fossil(session: Session, fossil_id: int) -> bool:
    """Deletes a fossil from the database."""
    fossil = session.get(Fossil, fossil_id)
    if not fossil:
        return False
    session.delete(fossil)
    session.commit()
    sync_fossils_to_json(session)
    return True

# ===============================================
# Visit CRUD Operations
# ===============================================

def create_visit(session: Session, user_id: int, room_visited: str) -> Visit:
    """Records a visit to a specific room."""
    visit = Visit(user_id=user_id, room_visited=room_visited)
    session.add(visit)
    session.commit()
    session.refresh(visit)
    return visit

def get_visit_stats(session: Session, user_id: Optional[int] = None) -> dict:
    """Gets visit statistics for a user or all users."""
    if user_id:
        statement = select(Visit).where(Visit.user_id == user_id)
        visits = list(session.exec(statement).all())
    else:
        statement = select(Visit)
        visits = list(session.exec(statement).all())
    
    # Calculate room counts
    room_counts = {}
    for visit in visits:
        room_counts[visit.room_visited] = room_counts.get(visit.room_visited, 0) + 1
    
    # Calculate comprehensive statistics
    total_visits = len(visits)
    unique_users = len(set(visit.user_id for visit in visits)) if visits else 0
    
    # Calculate average duration (mock for now - would need start/end timestamps in real impl)
    average_visit_duration = 0
    if visits:
        # Mock calculation: assume 5 minutes per visit on average
        average_visit_duration = 5
    
    return {
        "room_statistics": room_counts,
        "total_visits": total_visits,
        "unique_users": unique_users,
        "average_visit_duration": average_visit_duration
    }

# ===============================================
# High Score CRUD Operations
# ===============================================

def create_high_score(session: Session, user_id: int, score: int, game_mode: str) -> HighScore:
    """Records a new high score."""
    high_score = HighScore(user_id=user_id, score=score, game_mode=game_mode)
    session.add(high_score)
    session.commit()
    session.refresh(high_score)
    return high_score

def get_leaderboard(session: Session, game_mode: Optional[str] = None, limit: int = 10) -> List[HighScore]:
    """Gets the top scores, optionally filtered by game mode."""
    if game_mode:
        statement = select(HighScore).where(HighScore.game_mode == game_mode).order_by(HighScore.score.desc()).limit(limit)
    else:
        statement = select(HighScore).order_by(HighScore.score.desc()).limit(limit)
    return list(session.exec(statement).all())

def get_user_high_scores(session: Session, user_id: int) -> List[HighScore]:
    """Gets all high scores for a specific user."""
    statement = select(HighScore).where(HighScore.user_id == user_id).order_by(HighScore.score.desc())
    return list(session.exec(statement).all())

# ===============================================
# Feedback CRUD Operations
# ===============================================

def create_feedback(session: Session, user_id: int, rating: int, message: str) -> Feedback:
    """Records user feedback."""
    feedback = Feedback(user_id=user_id, rating=rating, message=message)
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    return feedback

def get_all_feedback(session: Session, limit: int = 50) -> List[Feedback]:
    """Gets recent feedback, sorted by most recent first."""
    statement = select(Feedback).order_by(Feedback.submitted_at.desc()).limit(limit)
    return list(session.exec(statement).all())

