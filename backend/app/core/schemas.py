from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ===============================================
# User Schemas
# These define the shape of user-related data.
# ===============================================

class UserCreate(BaseModel):
    """What we expect when a new user signs up."""
    email: str
    password: str

class UserLogin(BaseModel):
    """The data needed for a user to log in."""
    email: str
    password: str

class UserOut(BaseModel):
    """The user information we're comfortable sending back (no password!)."""
    id: int
    email: str
    created_at: datetime
    is_active: bool
    is_admin: bool = False

class Token(BaseModel):
    """The structure of the JWT token we'll send upon successful login."""
    access_token: str
    token_type: str

# ===============================================
# Temple Schemas
# Defines the data structure for our temples.
# ===============================================

class TempleOut(BaseModel):
    """The complete temple data we'll send to the frontend."""
    id: int
    name: str
    dynasty: str
    builder: str
    time_period: str
    historical_significance: str
    weapon_used: str
    static_image_url: str
    model_3d_embed: Optional[str] = None  # This will be the Sketchfab model ID.
    audio_story_url: str

class TempleCreate(BaseModel):
    """The data required to add a new temple to our collection."""
    name: str
    dynasty: str
    builder: str
    time_period: str
    historical_significance: str
    weapon_used: str
    static_image_url: str
    model_3d_embed: Optional[str] = None  # The Sketchfab model ID is optional.
    audio_story_url: str

# ===============================================
# Weapon Schemas
# For all the ancient weapons in our museum.
# ===============================================

class WeaponOut(BaseModel):
    """The data for a weapon that we'll show to the user."""
    id: int
    name: str
    dynasty_context: List[str]
    type: str
    description: str
    image_url: str
    model_3d_embed: Optional[str] = None  # Sketchfab ID, if we have one.
    audio_story_url: str

class WeaponCreate(BaseModel):
    """The information needed to add a new weapon."""
    name: str
    dynasty_context: List[str]
    type: str
    description: str
    image_url: str
    model_3d_embed: Optional[str] = None  # Optional Sketchfab ID.
    audio_story_url: str

# ===============================================
# Fossil Schemas
# For historical fossils and paleontological specimens.
# ===============================================

class FossilOut(BaseModel):
    """The complete fossil data we'll send to the frontend."""
    id: int
    name: str
    fossil_type: str
    era: str
    age_in_years: str
    description: str
    origin_location: str
    image_url: str
    model_3d_embed: Optional[str] = None
    audio_story_url: str

class FossilCreate(BaseModel):
    """The data required to add a new fossil to our collection."""
    name: str
    fossil_type: str
    era: str
    age_in_years: str
    description: str
    origin_location: str
    image_url: str
    model_3d_embed: Optional[str] = None
    audio_story_url: str

# ===============================================
# Visit Schemas
# Tracks museum visits.
# ===============================================

class VisitCreate(BaseModel):
    """Record of a user visiting a specific room."""
    room_visited: str

class VisitOut(BaseModel):
    """Visit information we send to the frontend."""
    id: int
    user_id: int
    visited_at: datetime
    room_visited: str

# ===============================================
# High Score Schemas
# For the gamification leaderboard.
# ===============================================

class HighScoreCreate(BaseModel):
    """Submit a new high score from the game."""
    score: int
    game_mode: str

class HighScoreOut(BaseModel):
    """High score information."""
    id: int
    user_id: int
    score: int
    game_mode: str
    achieved_at: datetime

# ===============================================
# Feedback Schemas
# User feedback about the experience.
# ===============================================

class FeedbackCreate(BaseModel):
    """User submits feedback about the museum."""
    rating: int  # 1-5 stars
    message: str

class FeedbackOut(BaseModel):
    """Feedback information."""
    id: int
    user_id: int
    rating: int
    message: str
    submitted_at: datetime
