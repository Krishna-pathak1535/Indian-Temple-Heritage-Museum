from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer
from ..core.jwt import decode_access_token
from ..db.crud import get_all_temples
from ..core.schemas import Temple
from pathlib import Path

STATIC_PATH = Path(__file__).parent.parent / "static"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
router = APIRouter(prefix="/api/v1/temples", tags=["temples"])

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

@router.get("/", response_model=list)
def get_temples(current_user=Depends(get_current_user)):
    temples = get_all_temples()
    return sorted([temple.dict() for temple in temples], key=lambda x: x["dynasty"])

@router.get("/media/{filename}")
def get_media(filename: str, current_user=Depends(get_current_user)):
    file_path = STATIC_PATH / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(str(file_path))
