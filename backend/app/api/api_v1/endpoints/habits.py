from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date, datetime
from app.core.database import get_db
from app.schemas.habit import (
    HabitCreate, HabitUpdate, Habit, HabitWithStats, 
    HabitLogCreate, HabitLog, TodayHabit
)
from app.models.habit import Habit as HabitModel
from app.models.habit_log import HabitLog as HabitLogModel
from app.api.api_v1.endpoints.auth import get_current_user
from app.models.user import User as UserModel
from app.services.micro_habit_engine import MicroHabitEngine
from app.services.adaptive_difficulty import AdaptiveDifficultyEngine
import uuid

router = APIRouter()

@router.get("", response_model=List[HabitWithStats])
async def get_habits(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all habits for the authenticated user."""
    habits = db.query(HabitModel).filter(HabitModel.user_id == current_user.user_id).all()
    
    habits_with_stats = []
    for habit in habits:
        # Calculate completion rate
        total_logs = len(habit.habit_logs)
        completed_logs = len([log for log in habit.habit_logs if log.completed])
        completion_rate = completed_logs / total_logs if total_logs > 0 else 0.0
        
        # Calculate streak (simplified - consecutive completed days)
        streak_days = 0
        if habit.habit_logs:
            sorted_logs = sorted(habit.habit_logs, key=lambda x: x.log_date, reverse=True)
            for log in sorted_logs:
                if log.completed:
                    streak_days += 1
                else:
                    break
        
        habits_with_stats.append(HabitWithStats(
            habit_id=habit.habit_id,
            user_id=habit.user_id,
            habit_name=habit.habit_name,
            habit_category=habit.habit_category,
            current_micro_habit=habit.current_micro_habit,
            is_active=habit.is_active,
            created_at=habit.created_at,
            completion_rate=completion_rate,
            streak_days=streak_days,
            total_logs=total_logs
        ))
    
    return habits_with_stats

@router.post("", response_model=Habit)
async def create_habit(
    habit_data: HabitCreate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new habit."""
    # Generate initial micro-habit
    micro_habit_engine = MicroHabitEngine()
    initial_micro_habit = micro_habit_engine.generate_initial_micro_habit(
        habit_data.habit_name, habit_data.habit_category
    )
    
    db_habit = HabitModel(
        user_id=current_user.user_id,
        habit_name=habit_data.habit_name,
        habit_category=habit_data.habit_category,
        current_micro_habit=initial_micro_habit
    )
    
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    
    return db_habit

@router.put("/{habit_id}", response_model=Habit)
async def update_habit(
    habit_id: uuid.UUID,
    habit_data: HabitUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a habit."""
    habit = db.query(HabitModel).filter(
        HabitModel.habit_id == habit_id,
        HabitModel.user_id == current_user.user_id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Update fields if provided
    if habit_data.habit_name is not None:
        habit.habit_name = habit_data.habit_name
    if habit_data.habit_category is not None:
        habit.habit_category = habit_data.habit_category
    if habit_data.is_active is not None:
        habit.is_active = habit_data.is_active
    if habit_data.current_micro_habit is not None:
        habit.current_micro_habit = habit_data.current_micro_habit.dict()
    
    db.commit()
    db.refresh(habit)
    
    return habit

@router.delete("/{habit_id}")
async def delete_habit(
    habit_id: uuid.UUID,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a habit."""
    habit = db.query(HabitModel).filter(
        HabitModel.habit_id == habit_id,
        HabitModel.user_id == current_user.user_id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    db.delete(habit)
    db.commit()
    
    return {"message": "Habit deleted successfully"}

@router.post("/log", response_model=HabitLog)
async def log_habit_completion(
    log_data: HabitLogCreate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log the completion status for a habit on a specific day."""
    # Verify the habit belongs to the user
    habit = db.query(HabitModel).filter(
        HabitModel.habit_id == log_data.habit_id,
        HabitModel.user_id == current_user.user_id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Check if log already exists for this date
    existing_log = db.query(HabitLogModel).filter(
        HabitLogModel.habit_id == log_data.habit_id,
        HabitLogModel.log_date == log_data.log_date
    ).first()
    
    if existing_log:
        # Update existing log
        existing_log.completed = log_data.completed
        existing_log.micro_habit_details = habit.current_micro_habit
        db.commit()
        db.refresh(existing_log)
        return existing_log
    else:
        # Create new log
        db_log = HabitLogModel(
            habit_id=log_data.habit_id,
            log_date=log_data.log_date,
            completed=log_data.completed,
            micro_habit_details=habit.current_micro_habit
        )
        
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
        
        return db_log

@router.get("/today", response_model=List[TodayHabit])
async def get_today_habits(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the micro-habit tasks for all active habits for the current day."""
    today = date.today()
    
    # Get all active habits for the user
    habits = db.query(HabitModel).filter(
        HabitModel.user_id == current_user.user_id,
        HabitModel.is_active == True
    ).all()
    
    today_habits = []
    for habit in habits:
        # Check if there's a log for today
        today_log = db.query(HabitLogModel).filter(
            HabitLogModel.habit_id == habit.habit_id,
            HabitLogModel.log_date == today
        ).first()
        
        completed_today = today_log.completed if today_log else False
        log_id = today_log.log_id if today_log else None
        
        today_habits.append(TodayHabit(
            habit_id=habit.habit_id,
            habit_name=habit.habit_name,
            habit_category=habit.habit_category,
            current_micro_habit=habit.current_micro_habit,
            completed_today=completed_today,
            log_id=log_id
        ))
    
    return today_habits

@router.post("/analyze-difficulty")
async def analyze_and_adjust_difficulty(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Trigger adaptive difficulty analysis for the current user's habits."""
    adaptive_engine = AdaptiveDifficultyEngine()
    
    # Get user's active habits
    user_habits = db.query(HabitModel).filter(
        HabitModel.user_id == current_user.user_id,
        HabitModel.is_active == True
    ).all()
    
    adjustments_made = []
    for habit in user_habits:
        adjustment = adaptive_engine._analyze_habit_performance(habit, db)
        if adjustment:
            adjustments_made.append(adjustment)
    
    return {
        "message": f"Analysis completed. Made {len(adjustments_made)} adjustments.",
        "adjustments": adjustments_made
    }

@router.get("/{habit_id}/insights")
async def get_habit_insights(
    habit_id: uuid.UUID,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed insights about a specific habit's performance."""
    # Verify the habit belongs to the user
    habit = db.query(HabitModel).filter(
        HabitModel.habit_id == habit_id,
        HabitModel.user_id == current_user.user_id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    adaptive_engine = AdaptiveDifficultyEngine()
    insights = adaptive_engine.get_habit_insights(habit, db)
    
    return insights
