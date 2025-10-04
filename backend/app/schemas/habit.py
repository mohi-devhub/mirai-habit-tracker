from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, date
import uuid

class MicroHabit(BaseModel):
    task: str
    unit: str
    value: int

class HabitBase(BaseModel):
    habit_name: str
    habit_category: Optional[str] = None

class HabitCreate(HabitBase):
    pass

class HabitUpdate(BaseModel):
    habit_name: Optional[str] = None
    habit_category: Optional[str] = None
    is_active: Optional[bool] = None
    current_micro_habit: Optional[MicroHabit] = None

class Habit(HabitBase):
    habit_id: uuid.UUID
    user_id: uuid.UUID
    current_micro_habit: Optional[Dict[str, Any]] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class HabitWithStats(Habit):
    completion_rate: float = 0.0
    streak_days: int = 0
    total_logs: int = 0

class HabitLogCreate(BaseModel):
    habit_id: uuid.UUID
    log_date: date
    completed: bool

class HabitLog(BaseModel):
    log_id: uuid.UUID
    habit_id: uuid.UUID
    log_date: date
    completed: bool
    micro_habit_details: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

class TodayHabit(BaseModel):
    habit_id: uuid.UUID
    habit_name: str
    habit_category: Optional[str] = None
    current_micro_habit: Optional[Dict[str, Any]] = None
    completed_today: bool = False
    log_id: Optional[uuid.UUID] = None

