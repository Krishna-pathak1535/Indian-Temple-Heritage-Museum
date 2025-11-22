from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from ..core.database import get_session
from ..core.schemas import FossilOut, FossilCreate
from ..db.crud import (
    get_all_fossils,
    get_fossil_by_id,
    create_fossil,
    update_fossil,
    delete_fossil,
)
from ..api.user import get_current_user
from ..db.models import User

router = APIRouter(prefix="/api/v1/content/fossils", tags=["fossils"])

@router.get("", response_model=list[FossilOut])
def get_fossils(session: Session = Depends(get_session)):
    """
    Retrieves all fossils from the paleontology collection.
    This is a public endpoint - anyone can view the fossils.
    """
    fossils = get_all_fossils(session)
    return fossils

@router.get("/{fossil_id}", response_model=FossilOut)
def get_fossil(fossil_id: int, session: Session = Depends(get_session)):
    """
    Gets detailed information about a specific fossil.
    """
    fossil = get_fossil_by_id(session, fossil_id)
    if not fossil:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fossil not found"
        )
    return fossil
