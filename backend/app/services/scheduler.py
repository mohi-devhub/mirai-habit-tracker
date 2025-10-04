from datetime import datetime, time
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.adaptive_difficulty import AdaptiveDifficultyEngine
from app.services.notification_service import NotificationService
import logging

logger = logging.getLogger(__name__)

class SchedulerService:
    """Service for running scheduled tasks like adaptive difficulty analysis."""
    
    def __init__(self):
        self.adaptive_engine = AdaptiveDifficultyEngine()
        self.notification_service = NotificationService()
    
    def run_daily_analysis(self) -> Dict[str, Any]:
        """Run daily analysis and adjustments for all habits."""
        db = SessionLocal()
        try:
            # Run adaptive difficulty analysis
            adjustments = self.adaptive_engine.analyze_and_adjust_habits(db)
            
            # Send notifications for adjustments
            for adjustment in adjustments:
                self._notify_about_adjustment(adjustment, db)
            
            logger.info(f"Daily analysis completed. Made {len(adjustments)} adjustments.")
            
            return {
                "timestamp": datetime.utcnow().isoformat(),
                "adjustments_made": len(adjustments),
                "adjustments": adjustments
            }
        
        except Exception as e:
            logger.error(f"Error in daily analysis: {str(e)}")
            raise
        finally:
            db.close()
    
    def _notify_about_adjustment(self, adjustment: Dict[str, Any], db: Session):
        """Send notification about difficulty adjustment."""
        try:
            # This would integrate with your notification system
            # For now, just log the adjustment
            logger.info(f"Difficulty adjustment for {adjustment['habit_name']}: {adjustment['adjustment_type']}")
            
            # TODO: Send push notification to user
            # self.notification_service.send_difficulty_adjustment_notification(
            #     user_id=adjustment['user_id'],
            #     habit_name=adjustment['habit_name'],
            #     adjustment_type=adjustment['adjustment_type'],
            #     new_micro_habit=adjustment['new_micro_habit']
            # )
        
        except Exception as e:
            logger.error(f"Error sending adjustment notification: {str(e)}")
    
    def send_daily_reminders(self) -> Dict[str, Any]:
        """Send daily reminder notifications to users."""
        db = SessionLocal()
        try:
            # This would query users who haven't completed their habits today
            # and send them reminder notifications
            
            # For now, just return a placeholder
            logger.info("Daily reminders sent")
            
            return {
                "timestamp": datetime.utcnow().isoformat(),
                "reminders_sent": 0  # Placeholder
            }
        
        except Exception as e:
            logger.error(f"Error sending daily reminders: {str(e)}")
            raise
        finally:
            db.close()

