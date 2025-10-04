from sqlalchemy import Column, Boolean, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid

class HabitLog(Base):
    __tablename__ = "habit_logs"
    
    log_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    habit_id = Column(UUID(as_uuid=True), ForeignKey("habits.habit_id"), nullable=False)
    log_date = Column(Date, nullable=False)
    completed = Column(Boolean, nullable=False)
    micro_habit_details = Column(JSONB)  # Snapshot of the micro-habit for that day
    
    # Relationships
    habit = relationship("Habit", back_populates="habit_logs")

