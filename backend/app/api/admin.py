from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from ..core.database import get_session
from ..core.schemas import (
    TempleCreate, TempleOut,
    WeaponCreate, WeaponOut,
    FossilCreate, FossilOut,
    FeedbackOut
)
from ..db.crud import (
    create_temple, update_temple, delete_temple,
    create_weapon, update_weapon, delete_weapon,
    create_fossil, update_fossil, delete_fossil,
    get_visit_stats,
    get_leaderboard,
    get_all_feedback,
)
from ..api.user import get_current_user
from ..db.models import User

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])

def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    This dependency checks if the current user is an admin.
    Only admins can access admin endpoints.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# ===============================================
# Temple Content Management
# ===============================================

@router.post("/temples", response_model=TempleOut)
def add_temple(
    temple_data: TempleCreate,
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can upload new temple data to the museum collection.
    """
    temple = create_temple(session, temple_data.dict())
    return temple

@router.put("/temples/{temple_id}", response_model=TempleOut)
def edit_temple(
    temple_id: int,
    temple_data: TempleCreate,
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can update existing temple information.
    """
    temple = update_temple(session, temple_id, temple_data.dict())
    if not temple:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Temple not found"
        )
    return temple

@router.delete("/temples/{temple_id}")
def remove_temple(
    temple_id: int,
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can delete temple entries from the collection.
    """
    success = delete_temple(session, temple_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Temple not found"
        )
    return {"message": "Temple deleted successfully"}

# ===============================================
# Weapon Content Management
# ===============================================

@router.post("/weapons", response_model=WeaponOut)
def add_weapon(
    weapon_data: WeaponCreate,
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can upload new weapon data to the museum collection.
    """
    weapon = create_weapon(session, weapon_data.dict())
    return weapon

@router.put("/weapons/{weapon_id}", response_model=WeaponOut)
def edit_weapon(
    weapon_id: int,
    weapon_data: WeaponCreate,
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can update existing weapon information.
    """
    weapon = update_weapon(session, weapon_id, weapon_data.dict())
    if not weapon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Weapon not found"
        )
    return weapon

@router.delete("/weapons/{weapon_id}")
def remove_weapon(
    weapon_id: int,
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can delete weapon entries from the collection.
    """
    success = delete_weapon(session, weapon_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Weapon not found"
        )
    return {"message": "Weapon deleted successfully"}

# ===============================================
# Fossil Content Management
# ===============================================

@router.post("/fossils", response_model=FossilOut)
def add_fossil(
    fossil_data: FossilCreate,
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can upload new fossil data to the museum collection.
    """
    fossil = create_fossil(session, fossil_data.dict(), admin.id)
    return fossil

@router.put("/fossils/{fossil_id}", response_model=FossilOut)
def edit_fossil(
    fossil_id: int,
    fossil_data: FossilCreate,
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can update existing fossil information.
    """
    fossil = update_fossil(session, fossil_id, fossil_data.dict(), admin.id)
    if not fossil:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fossil not found"
        )
    return fossil

@router.delete("/fossils/{fossil_id}")
def remove_fossil(
    fossil_id: int,
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can delete fossil entries from the collection.
    """
    success = delete_fossil(session, fossil_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fossil not found"
        )
    return {"message": "Fossil deleted successfully"}

# ===============================================
# Analytics & Dashboard
# ===============================================

@router.get("/visits/stats")
def get_visit_statistics(
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can view statistics on how many times each room has been visited.
    This helps track which areas are most popular.
    """
    stats = get_visit_stats(session)
    return stats

@router.get("/leaderboard")
def get_top_scores(
    game_mode: str = None,
    limit: int = 10,
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can view the top scores from the game section.
    Optionally filter by game mode to see specific game results.
    """
    scores = get_leaderboard(session, game_mode, limit)
    return {"leaderboard": scores}

@router.get("/feedback")
def get_user_feedback(
    limit: int = 50,
    session: Session = Depends(get_session),
    admin: User = Depends(get_current_admin),
):
    """
    Admins can view all user feedback about the museum experience.
    This helps identify areas for improvement.
    """
    feedback = get_all_feedback(session, limit)
    return {"feedback": feedback}
