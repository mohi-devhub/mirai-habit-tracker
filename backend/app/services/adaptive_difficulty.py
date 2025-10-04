from typing import List, Dict, Any, Optional
from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.models.habit import Habit as HabitModel
from app.models.habit_log import HabitLog as HabitLogModel
from app.services.micro_habit_engine import MicroHabitEngine

class AdaptiveDifficultyEngine:
    """AI-powered adaptive difficulty adjustment based on user performance."""
    
    def __init__(self):
        self.micro_habit_engine = MicroHabitEngine()
        # Scoring parameters
        self.completion_score = 1.0
        self.miss_score = -1.5
        self.increase_threshold = 4.0  # Score needed to increase difficulty
        self.decrease_threshold = -3.0  # Score needed to decrease difficulty
        self.analysis_days = 7  # Number of days to analyze
    
    def analyze_and_adjust_habits(self, db: Session) -> List[Dict[str, Any]]:
        """Analyze all active habits and adjust their difficulty if needed."""
        adjustments_made = []
        
        # Get all active habits
        active_habits = db.query(HabitModel).filter(HabitModel.is_active == True).all()
        
        for habit in active_habits:
            adjustment = self._analyze_habit_performance(habit, db)
            if adjustment:
                adjustments_made.append(adjustment)
        
        return adjustments_made
    
    def _analyze_habit_performance(self, habit: HabitModel, db: Session) -> Optional[Dict[str, Any]]:
        """Analyze a single habit's performance and return adjustment if needed."""
        # Get recent logs for analysis
        end_date = date.today()
        start_date = end_date - timedelta(days=self.analysis_days)
        
        recent_logs = db.query(HabitLogModel).filter(
            HabitLogModel.habit_id == habit.habit_id,
            HabitLogModel.log_date >= start_date,
            HabitLogModel.log_date <= end_date
        ).order_by(HabitLogModel.log_date.desc()).all()
        
        if len(recent_logs) < 3:  # Need at least 3 days of data
            return None
        
        # Calculate performance score
        score = self._calculate_performance_score(recent_logs)
        
        # Determine if adjustment is needed
        current_micro_habit = habit.current_micro_habit or {}
        
        if score >= self.increase_threshold:
            # Increase difficulty
            new_micro_habit = self.micro_habit_engine.get_next_difficulty_level(
                current_micro_habit, habit.habit_name
            )
            if new_micro_habit and new_micro_habit != current_micro_habit:
                habit.current_micro_habit = new_micro_habit
                db.commit()
                
                return {
                    "habit_id": habit.habit_id,
                    "habit_name": habit.habit_name,
                    "adjustment_type": "increase",
                    "old_micro_habit": current_micro_habit,
                    "new_micro_habit": new_micro_habit,
                    "score": score,
                    "reason": f"Consistent completion (score: {score:.1f})"
                }
        
        elif score <= self.decrease_threshold:
            # Decrease difficulty
            new_micro_habit = self.micro_habit_engine.get_previous_difficulty_level(
                current_micro_habit, habit.habit_name
            )
            if new_micro_habit and new_micro_habit != current_micro_habit:
                habit.current_micro_habit = new_micro_habit
                db.commit()
                
                return {
                    "habit_id": habit.habit_id,
                    "habit_name": habit.habit_name,
                    "adjustment_type": "decrease",
                    "old_micro_habit": current_micro_habit,
                    "new_micro_habit": new_micro_habit,
                    "score": score,
                    "reason": f"Struggling with consistency (score: {score:.1f})"
                }
        
        return None
    
    def _calculate_performance_score(self, logs: List[HabitLogModel]) -> float:
        """Calculate performance score based on recent logs."""
        if not logs:
            return 0.0
        
        score = 0.0
        consecutive_misses = 0
        consecutive_completions = 0
        
        for log in logs:
            if log.completed:
                score += self.completion_score
                consecutive_completions += 1
                consecutive_misses = 0
                
                # Bonus for consecutive completions
                if consecutive_completions >= 3:
                    score += 0.5
                if consecutive_completions >= 5:
                    score += 1.0
            else:
                score += self.miss_score
                consecutive_misses += 1
                consecutive_completions = 0
                
                # Penalty for consecutive misses
                if consecutive_misses >= 2:
                    score -= 1.0
                if consecutive_misses >= 3:
                    score -= 2.0
        
        return score
    
    def get_habit_insights(self, habit: HabitModel, db: Session) -> Dict[str, Any]:
        """Get detailed insights about a habit's performance."""
        # Get logs from the last 30 days
        end_date = date.today()
        start_date = end_date - timedelta(days=30)
        
        logs = db.query(HabitLogModel).filter(
            HabitLogModel.habit_id == habit.habit_id,
            HabitLogModel.log_date >= start_date,
            HabitLogModel.log_date <= end_date
        ).order_by(HabitLogModel.log_date.desc()).all()
        
        if not logs:
            return {
                "total_days": 0,
                "completion_rate": 0.0,
                "current_streak": 0,
                "longest_streak": 0,
                "average_score": 0.0,
                "recommendation": "Start logging your habit to get insights!"
            }
        
        # Calculate metrics
        total_days = len(logs)
        completed_days = len([log for log in logs if log.completed])
        completion_rate = completed_days / total_days if total_days > 0 else 0.0
        
        # Calculate streaks
        current_streak = self._calculate_current_streak(logs)
        longest_streak = self._calculate_longest_streak(logs)
        
        # Calculate average score
        recent_logs = logs[:self.analysis_days] if len(logs) >= self.analysis_days else logs
        average_score = self._calculate_performance_score(recent_logs)
        
        # Generate recommendation
        recommendation = self._generate_recommendation(completion_rate, current_streak, average_score)
        
        return {
            "total_days": total_days,
            "completion_rate": completion_rate,
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "average_score": average_score,
            "recommendation": recommendation
        }
    
    def _calculate_current_streak(self, logs: List[HabitLogModel]) -> int:
        """Calculate current streak of consecutive completions."""
        streak = 0
        for log in logs:
            if log.completed:
                streak += 1
            else:
                break
        return streak
    
    def _calculate_longest_streak(self, logs: List[HabitLogModel]) -> int:
        """Calculate longest streak of consecutive completions."""
        longest_streak = 0
        current_streak = 0
        
        for log in reversed(logs):  # Go chronologically
            if log.completed:
                current_streak += 1
                longest_streak = max(longest_streak, current_streak)
            else:
                current_streak = 0
        
        return longest_streak
    
    def _generate_recommendation(self, completion_rate: float, current_streak: int, average_score: float) -> str:
        """Generate a personalized recommendation based on performance."""
        if completion_rate >= 0.8 and current_streak >= 5:
            return "Excellent progress! You're ready for a more challenging micro-habit."
        elif completion_rate >= 0.6 and current_streak >= 3:
            return "Great consistency! Keep up the momentum."
        elif completion_rate >= 0.4:
            return "Good progress! Try to maintain consistency for a few more days."
        elif completion_rate >= 0.2:
            return "You're building momentum! Consider making the micro-habit even smaller."
        else:
            return "Let's start with a very small, achievable micro-habit to build confidence."

