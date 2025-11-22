"""
Script to create an admin user in the database.
Run this script once to create the admin account.

Usage: python create_admin.py
"""

from sqlmodel import Session, select
from app.db.models import User
from app.core.security import hash_password
from app.core.database import initialize_engine

def create_admin_user():
    """Creates an admin user with predefined credentials."""
    
    # Admin credentials
    ADMIN_EMAIL = "admin@museum.com"
    ADMIN_PASSWORD = "admin123"  # Change this to a secure password!
    
    print("\n" + "="*80)
    print("🔧 ADMIN USER CREATION SCRIPT")
    print("="*80)
    
    try:
        # Initialize database connection
        engine = initialize_engine()
        
        with Session(engine) as session:
            # Check if admin user already exists
            print(f"\n🔍 Checking if admin user exists: {ADMIN_EMAIL}")
            existing_admin = session.exec(
                select(User).where(User.email == ADMIN_EMAIL.lower())
            ).first()
            
            if existing_admin:
                print(f"⚠️  Admin user already exists!")
                print(f"   Email: {existing_admin.email}")
                print(f"   Admin Status: {existing_admin.is_admin}")
                print(f"   Created: {existing_admin.created_at}")
                
                # Update to admin if not already
                if not existing_admin.is_admin:
                    print("\n🔄 Updating user to admin status...")
                    existing_admin.is_admin = True
                    session.add(existing_admin)
                    session.commit()
                    print("✅ User updated to admin!")
                else:
                    print("\n✅ Admin user is already configured correctly.")
                
                print(f"\n📧 Email: {ADMIN_EMAIL}")
                print(f"🔑 Password: {ADMIN_PASSWORD}")
                
            else:
                # Create new admin user
                print(f"✨ Creating new admin user...")
                
                hashed_password = hash_password(ADMIN_PASSWORD)
                admin_user = User(
                    email=ADMIN_EMAIL.lower(),
                    hashed_password=hashed_password,
                    is_admin=True,
                    is_active=True
                )
                
                session.add(admin_user)
                session.commit()
                session.refresh(admin_user)
                
                print("\n" + "="*80)
                print("✅ ADMIN USER CREATED SUCCESSFULLY!")
                print("="*80)
                print(f"\n📧 Email: {ADMIN_EMAIL}")
                print(f"🔑 Password: {ADMIN_PASSWORD}")
                print(f"\n⚠️  IMPORTANT: Change the password after first login!")
                print("="*80)
                
    except Exception as e:
        print(f"\n❌ ERROR: Failed to create admin user")
        print(f"Details: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("\n🕉️  Indian Temple Heritage Museum - Admin Setup\n")
    success = create_admin_user()
    
    if success:
        print("\n✅ Admin setup complete!")
        print("\nYou can now login at: http://localhost:5174")
        print("Navigate to: http://localhost:5174/admin")
    else:
        print("\n❌ Admin setup failed. Please check the error messages above.")
    
    print("\n" + "="*80 + "\n")
