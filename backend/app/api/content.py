from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from ..core.jwt import decode_access_token
from ..db.crud import get_all_temples, get_all_weapons, get_all_fossils
from ..core.schemas import TempleOut, WeaponOut, FossilOut
from ..core.database import get_session
from ..api.user import get_current_user
from pathlib import Path

STATIC_PATH = Path(__file__).parent.parent / "static"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
router = APIRouter(prefix="/api/v1/content", tags=["content"])

@router.get("/temples", response_model=list[TempleOut])
def get_temples(current_user=Depends(get_current_user), session: Session = Depends(get_session)):
    """Fetches all temple records, adding the correct paths for media files."""
    temples = get_all_temples(session)
    return [TempleOut(
        id=t.id,
        name=t.name,
        dynasty=t.dynasty,
        builder=t.builder,
        time_period=t.time_period,
        historical_significance=t.historical_significance,
        weapon_used=t.weapon_used,
        static_image_url=f"temples/{t.static_image_url}",  # We add the 'temples/' prefix here
        model_3d_embed=t.model_3d_embed,
        audio_story_url=f"temples/{t.audio_story_url}"      # And here too
    ) for t in temples]

@router.get("/weapons", response_model=list[WeaponOut])
def get_weapons(current_user=Depends(get_current_user), session: Session = Depends(get_session)):
    """Fetches all weapon records, adding the correct paths for media files."""
    weapons = get_all_weapons(session)
    return [WeaponOut(
        id=w.id,
        name=w.name,
        dynasty_context=w.dynasty_context,
        type=w.type,
        description=w.description,
        image_url=f"weapons/{w.image_url}",        # Adding the 'weapons/' prefix
        model_3d_embed=w.model_3d_embed,
        audio_story_url=f"weapons/{w.audio_story_url}"  # And for the audio
    ) for w in weapons]

@router.get("/fossils", response_model=list[FossilOut])
def get_fossils(current_user=Depends(get_current_user), session: Session = Depends(get_session)):
    """Fetches all fossil records from the paleontology collection."""
    fossils = get_all_fossils(session)
    return [FossilOut(
        id=f.id,
        name=f.name,
        fossil_type=f.fossil_type,
        era=f.era,
        age_in_years=f.age_in_years,
        description=f.description,
        origin_location=f.origin_location,
        image_url=f"fossils/{f.image_url}",
        model_3d_embed=f.model_3d_embed,
        audio_story_url=f"fossils/{f.audio_story_url}"
    ) for f in fossils]

@router.get("/media/{category}/{media_type}/{filename}")
def get_media(category: str, media_type: str, filename: str, token: str = None):
    """
    This endpoint serves up our static files like images and audio.
    It's like a bouncer for our media, making sure everything is requested correctly.
    """
    # If a token is provided, we should check if it's valid.
    if token:
        try:
            decode_access_token(token)
        except Exception as e:
            raise HTTPException(status_code=401, detail="Your token is invalid or has expired. Please log in again.")
    
    # Let's make sure the requested category and media type are valid.
    valid_categories = ["temples", "weapons", "fossils"]
    valid_media_types = ["images", "audio"]
    
    if category not in valid_categories:
        raise HTTPException(status_code=400, detail=f"Sorry, '{category}' is not a valid category.")
    
    if media_type not in valid_media_types:
        raise HTTPException(status_code=400, detail=f"Sorry, '{media_type}' is not a valid media type.")
    
    # Now, let's build the full path to the file.
    file_path = STATIC_PATH / media_type / category / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"We couldn't find the file '{filename}'.")
    
    # We need to tell the browser what kind of file we're sending (e.g., an image or an audio file).
    media_types_map = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
    }
    
    file_extension = filename.split('.')[-1].lower()
    content_type = media_types_map.get(file_extension, 'application/octet-stream')
    
    return FileResponse(
        str(file_path),
        media_type=content_type,
        headers={
            "Cache-Control": "public, max-age=3600", # Let's cache this for an hour to speed things up.
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*"
        }
    )