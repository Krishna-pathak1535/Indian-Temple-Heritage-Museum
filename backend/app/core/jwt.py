from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

# Here we're defining the secret key and algorithm for our JWTs.
# It's important to keep the secret key safe in a real-world application.
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    This function creates a new access token.
    You can pass in the data you want to encode and an optional expiration time.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """
    This function decodes an access token.
    It's useful for verifying a token and getting the data stored inside.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        # If the token is invalid or expired, we'll return None.
        return None
