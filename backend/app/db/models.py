from sqlmodel import SQLModel, Field, Column, JSON
from typing import Optional, List
from datetime import datetime

class User(SQLModel, table=True):
    """This model represents a user in our system, used for authentication."""
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
    is_admin: bool = Field(default=False)  # Admin flag for content management

class Temple(SQLModel, table=True):
    """This model holds all the data for a single temple."""
    __tablename__ = "temples"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=255)
    dynasty: str = Field(max_length=255)
    builder: str = Field(max_length=255)
    time_period: str = Field(max_length=255)
    historical_significance: str = Field(sa_column=Column("historical_significance", JSON))
    weapon_used: str = Field(max_length=255)
    static_image_url: str = Field(max_length=500)
    model_3d_embed: Optional[str] = Field(default=None, max_length=500)  # This will be the Sketchfab model ID.
    audio_story_url: str = Field(max_length=500)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Weapon(SQLModel, table=True):
    """This model is for the data related to ancient weapons."""
    __tablename__ = "weapons"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=255)
    dynasty_context: List[str] = Field(sa_column=Column("dynasty_context", JSON))
    type: str = Field(max_length=100)
    description: str = Field(sa_column=Column("description", JSON))
    image_url: str = Field(max_length=500)
    model_3d_embed: Optional[str] = Field(default=None, max_length=500)  # This will be the Sketchfab model ID.
    audio_story_url: str = Field(max_length=500)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Fossil(SQLModel, table=True):
    """This model stores information about historical fossils and paleontological specimens."""
    __tablename__ = "fossils"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=255)  # e.g., Ammonite, Trilobite
    fossil_type: str = Field(max_length=100)  # Category of fossil
    era: str = Field(max_length=100)  # Geological era (e.g., Jurassic, Cambrian)
    age_in_years: str = Field(max_length=100)  # Human-readable age (e.g., "200 million years ago")
    description: str = Field(sa_column=Column("description", JSON))  # Detailed paleontological information
    origin_location: str = Field(max_length=255)  # Where the fossil was found
    image_url: str = Field(max_length=500)
    model_3d_embed: Optional[str] = Field(default=None, max_length=500)  # Sketchfab model ID for 3D visualization
    audio_story_url: str = Field(max_length=500)  # Audio narration about the fossil
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: Optional[int] = Field(default=None, foreign_key="users.id")  # Admin who last updated

class Visit(SQLModel, table=True):
    """Tracks visits to the museum by users."""
    __tablename__ = "visits"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    visited_at: datetime = Field(default_factory=datetime.utcnow)
    room_visited: str = Field(max_length=50)  # temples, weapons, fossils, game

class HighScore(SQLModel, table=True):
    """Tracks high scores from the gamification section."""
    __tablename__ = "high_scores"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    score: int = Field(index=True)
    game_mode: str = Field(max_length=100)  # Type of game/quiz
    achieved_at: datetime = Field(default_factory=datetime.utcnow)

class Feedback(SQLModel, table=True):
    """Stores user feedback about the museum experience."""
    __tablename__ = "feedback"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    rating: int = Field(ge=1, le=5)  # 1-5 star rating
    message: str = Field(max_length=1000)
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
