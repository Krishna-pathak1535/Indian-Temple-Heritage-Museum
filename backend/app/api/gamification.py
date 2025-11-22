from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from ..core.database import get_session
from ..core.schemas import HighScoreCreate, HighScoreOut
from ..db.crud import create_high_score, get_leaderboard, get_user_high_scores
from ..api.user import get_current_user
from ..db.models import User

router = APIRouter(prefix="/api/v1/gamification", tags=["gamification"])

@router.post("/score", response_model=HighScoreOut)
def submit_game_score(
    score_data: HighScoreCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Users can submit their game scores after completing a quiz or game.
    Scores are saved to the leaderboard for each game mode.
    """
    high_score = create_high_score(
        session,
        current_user.id,
        score_data.score,
        score_data.game_mode
    )
    return high_score

@router.get("/leaderboard", response_model=list[HighScoreOut])
def get_game_leaderboard(
    game_mode: str = None,
    limit: int = 20,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Get the top scores from the leaderboard.
    Can be filtered by game mode (e.g., 'temples-quiz', 'weapons-quiz', 'fossils-quiz').
    """
    scores = get_leaderboard(session, game_mode, limit)
    return scores

@router.get("/my-scores", response_model=list[HighScoreOut])
def get_my_high_scores(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Get the current user's high scores across all game modes.
    """
    scores = get_user_high_scores(session, current_user.id)
    return scores
