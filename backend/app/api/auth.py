from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from ..core.schemas import UserCreate, UserLogin, Token, UserOut
from ..db.crud import create_user, get_user_by_email
from ..core.security import verify_password
from ..core.jwt import create_access_token
from ..core.database import get_session

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/register", response_model=dict)
def register(user: UserCreate, session: Session = Depends(get_session)):
    """
    Handles new user registration.
    It's case-insensitive, so 'user@example.com' and 'USER@example.com' are treated as the same.
    """
    # We'll convert the email to lowercase to ensure we don't have duplicate accounts with different casing.
    normalized_email = user.email.lower().strip()
    
    print(f"📝 Registration attempt for: {normalized_email}")
    
    # Let's check if someone has already registered with this email.
    existing = get_user_by_email(session, normalized_email)
    if existing:
        print(f"⚠️  User already exists: {normalized_email}")
        raise HTTPException(
            status_code=400, 
            detail=f"Looks like '{user.email}' is already registered. Try logging in or use a different email."
        )
    
    # All good? Let's create the new user account.
    print(f"✅ Creating new user: {normalized_email}")
    new_user = create_user(session, normalized_email, user.password)
    print(f"✓ User created with ID: {new_user.id}")
    return {"message": "Welcome! Your account has been created successfully."}

@router.post("/login", response_model=Token)
def login(form_data: UserLogin, session: Session = Depends(get_session)):
    """
    Handles user login.
    Just like registration, email matching is case-insensitive.
    """
    # Normalize the email to make sure we can find the user, regardless of how they typed it.
    normalized_email = form_data.email.lower().strip()
    
    user = get_user_by_email(session, normalized_email)
    
    # Debug logging
    print(f"🔍 Login attempt for: {normalized_email}")
    print(f"👤 User found: {user is not None}")
    
    if not user:
        print("❌ User not found in database")
        raise HTTPException(
            status_code=401, 
            detail="Invalid email or password. Please try again."
        )
    
    print(f"🔐 Verifying password...")
    password_valid = verify_password(form_data.password, user.hashed_password)
    print(f"✓ Password valid: {password_valid}")
    
    if not password_valid:
        print("❌ Password verification failed")
        raise HTTPException(
            status_code=401, 
            detail="Invalid email or password. Please try again."
        )
    
    # If the credentials are correct, we'll create a token that the user can use to access protected parts of the museum.
    print(f"✅ Login successful for {user.email} (Admin: {user.is_admin})")
    access_token = create_access_token({"sub": user.email, "id": user.id})
    return Token(access_token=access_token, token_type="bearer")
