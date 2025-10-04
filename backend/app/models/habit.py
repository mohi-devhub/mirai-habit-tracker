from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid
from datetime import datetime, timezone

class Habit(Base):
    __tablename__ = "habits"
    
    habit_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    habit_name = Column(String, nullable=False)
    habit_category = Column(String)  # e.g., 'Health', 'Learning', 'Productivity'
    current_micro_habit = Column(JSONB)  # e.g., {'task': 'Read for 5 minutes', 'unit': 'minutes', 'value': 5}
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User", back_populates="habits")
    habit_logs = relationship("HabitLog", back_populates="habit", cascade="all, delete-orphan")

