import bcrypt

def hash_password(password: str) -> str:
    """
    Hashes a password using bcrypt. It's a good practice to limit the password 
    length to 72 bytes, as bcrypt has this limitation.
    """
    # We'll encode the password to bytes and truncate if it's too long.
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Checks if a plain password matches its hashed version.
    We need to truncate the plain password just like we did when hashing it.
    """
    # Truncate the password to ensure it matches the hashing behavior.
    plain_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_bytes, hashed_bytes)
