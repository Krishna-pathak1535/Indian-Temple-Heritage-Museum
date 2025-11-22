from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from ..core.database import get_session
from ..core.schemas import FeedbackCreate, FeedbackOut
from ..db.crud import create_feedback, create_visit
from ..api.user import get_current_user
from ..db.models import User

router = APIRouter(prefix="/api/v1/user", tags=["user"])

@router.post("/feedback", response_model=FeedbackOut)
def submit_feedback(
    feedback_data: FeedbackCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Users can submit feedback about their experience in the museum.
    This includes a rating (1-5 stars) and a message.
    """
    feedback = create_feedback(
        session,
        current_user.id,
        feedback_data.rating,
        feedback_data.message
    )
    return feedback

@router.post("/track-visit")
def track_room_visit(
    visit_data: dict,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Tracks when a user visits a specific room.
    This data helps admins understand which areas are most visited.
    Valid rooms: "temples", "weapons", "fossils", "game"
    """
    room_name = visit_data.get('room')
    if not room_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Room name is required"
        )
    
    valid_rooms = ["temples", "weapons", "fossils", "game"]
    if room_name not in valid_rooms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid room. Valid rooms are: {valid_rooms}"
        )
    
    visit = create_visit(session, current_user.id, room_name)
    return {"message": f"Visit to {room_name} recorded"}
