from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, verify_token
from app.schemas.user import UserCreate, UserLogin, User, Token, UserProfile
from app.models.user import User as UserModel
from datetime import timedelta
from app.core.config import settings

router = APIRouter()
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> UserModel:
    """Get the current authenticated user."""
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

@router.post("/signup", response_model=User)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    existing_user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = UserModel(
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate a user and return a JWT."""
    user = db.query(UserModel).filter(UserModel.email == user_credentials.email).first()
    
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.user_id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(current_user: UserModel = Depends(get_current_user)):
    """Get the current user's profile with statistics."""
    # Calculate user statistics
    total_habits = len(current_user.habits)
    active_habits = len([h for h in current_user.habits if h.is_active])
    
    # Calculate completion rate (simplified - you might want to make this more sophisticated)
    completion_rate = 0.0
    if total_habits > 0:
        total_logs = sum(len(habit.habit_logs) for habit in current_user.habits)
        completed_logs = sum(
            len([log for log in habit.habit_logs if log.completed]) 
            for habit in current_user.habits
        )
        if total_logs > 0:
            completion_rate = completed_logs / total_logs
    
    return UserProfile(
        user_id=current_user.user_id,
        email=current_user.email,
        full_name=current_user.full_name,
        created_at=current_user.created_at,
        total_habits=total_habits,
        active_habits=active_habits,
        completion_rate=completion_rate
    )

