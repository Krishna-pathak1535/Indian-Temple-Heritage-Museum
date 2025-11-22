from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from ..core.jwt import decode_access_token
from ..db.crud import get_user_by_email
from ..core.schemas import UserOut
from ..core.database import get_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
router = APIRouter(prefix="/api/v1/user", tags=["user"])

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    """
    This function is our gatekeeper. It checks the user's token to make sure they're logged in and their session is valid.
    """
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Your session is invalid. Please log in again.")
    
    user = get_user_by_email(session, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=404, detail="We couldn't find a user with that token. Please log in again.")
    
    return user

@router.get("/me", response_model=UserOut)
def get_me(current_user = Depends(get_current_user)):
    """
    This endpoint simply returns the details of the currently logged-in user.
    """
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        created_at=current_user.created_at,
        is_active=current_user.is_active,
        is_admin=current_user.is_admin
    )
