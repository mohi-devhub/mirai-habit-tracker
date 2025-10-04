from typing import Dict, Any, Optional
import re

class MicroHabitEngine:
    """AI-powered micro-habit generation and management engine."""
    
    def __init__(self):
        # Predefined habit templates with initial micro-habits
        self.habit_templates = {
            "exercise": {
                "patterns": ["exercise", "workout", "fitness", "gym", "run", "jog", "walk"],
                "initial_micro_habit": {
                    "task": "Do 5 minutes of light exercise",
                    "unit": "minutes",
                    "value": 5,
                    "type": "time_based"
                },
                "difficulty_levels": [
                    {"value": 5, "unit": "minutes", "task": "Do 5 minutes of light exercise"},
                    {"value": 10, "unit": "minutes", "task": "Do 10 minutes of exercise"},
                    {"value": 15, "unit": "minutes", "task": "Do 15 minutes of exercise"},
                    {"value": 20, "unit": "minutes", "task": "Do 20 minutes of exercise"},
                    {"value": 30, "unit": "minutes", "task": "Do 30 minutes of exercise"}
                ]
            },
            "reading": {
                "patterns": ["read", "book", "study", "learn"],
                "initial_micro_habit": {
                    "task": "Read for 5 minutes",
                    "unit": "minutes",
                    "value": 5,
                    "type": "time_based"
                },
                "difficulty_levels": [
                    {"value": 5, "unit": "minutes", "task": "Read for 5 minutes"},
                    {"value": 10, "unit": "minutes", "task": "Read for 10 minutes"},
                    {"value": 15, "unit": "minutes", "task": "Read for 15 minutes"},
                    {"value": 20, "unit": "minutes", "task": "Read for 20 minutes"},
                    {"value": 30, "unit": "minutes", "task": "Read for 30 minutes"}
                ]
            },
            "meditation": {
                "patterns": ["meditate", "mindfulness", "meditation", "breathe"],
                "initial_micro_habit": {
                    "task": "Meditate for 3 minutes",
                    "unit": "minutes",
                    "value": 3,
                    "type": "time_based"
                },
                "difficulty_levels": [
                    {"value": 3, "unit": "minutes", "task": "Meditate for 3 minutes"},
                    {"value": 5, "unit": "minutes", "task": "Meditate for 5 minutes"},
                    {"value": 10, "unit": "minutes", "task": "Meditate for 10 minutes"},
                    {"value": 15, "unit": "minutes", "task": "Meditate for 15 minutes"},
                    {"value": 20, "unit": "minutes", "task": "Meditate for 20 minutes"}
                ]
            },
            "water": {
                "patterns": ["water", "hydrate", "drink"],
                "initial_micro_habit": {
                    "task": "Drink 1 glass of water",
                    "unit": "glasses",
                    "value": 1,
                    "type": "quantity_based"
                },
                "difficulty_levels": [
                    {"value": 1, "unit": "glasses", "task": "Drink 1 glass of water"},
                    {"value": 2, "unit": "glasses", "task": "Drink 2 glasses of water"},
                    {"value": 3, "unit": "glasses", "task": "Drink 3 glasses of water"},
                    {"value": 4, "unit": "glasses", "task": "Drink 4 glasses of water"},
                    {"value": 5, "unit": "glasses", "task": "Drink 5 glasses of water"}
                ]
            },
            "sleep": {
                "patterns": ["sleep", "bedtime", "rest"],
                "initial_micro_habit": {
                    "task": "Go to bed 15 minutes earlier",
                    "unit": "minutes",
                    "value": 15,
                    "type": "time_based"
                },
                "difficulty_levels": [
                    {"value": 15, "unit": "minutes", "task": "Go to bed 15 minutes earlier"},
                    {"value": 30, "unit": "minutes", "task": "Go to bed 30 minutes earlier"},
                    {"value": 45, "unit": "minutes", "task": "Go to bed 45 minutes earlier"},
                    {"value": 60, "unit": "minutes", "task": "Go to bed 1 hour earlier"},
                    {"value": 90, "unit": "minutes", "task": "Go to bed 1.5 hours earlier"}
                ]
            }
        }
    
    def generate_initial_micro_habit(self, habit_name: str, habit_category: Optional[str] = None) -> Dict[str, Any]:
        """Generate an initial micro-habit based on the habit name and category."""
        habit_name_lower = habit_name.lower()
        
        # Try to match against predefined templates
        for template_name, template_data in self.habit_templates.items():
            for pattern in template_data["patterns"]:
                if pattern in habit_name_lower:
                    return template_data["initial_micro_habit"]
        
        # If no match found, create a generic micro-habit
        return self._create_generic_micro_habit(habit_name, habit_category)
    
    def _create_generic_micro_habit(self, habit_name: str, habit_category: Optional[str] = None) -> Dict[str, Any]:
        """Create a generic micro-habit when no template matches."""
        # Extract key words from habit name
        words = re.findall(r'\b\w+\b', habit_name.lower())
        
        # Create a simple micro-habit based on common patterns
        if any(word in words for word in ["do", "practice", "work"]):
            return {
                "task": f"Spend 5 minutes on {habit_name.lower()}",
                "unit": "minutes",
                "value": 5,
                "type": "time_based"
            }
        elif any(word in words for word in ["eat", "drink", "consume"]):
            return {
                "task": f"Have 1 serving of {habit_name.lower()}",
                "unit": "servings",
                "value": 1,
                "type": "quantity_based"
            }
        else:
            return {
                "task": f"Do {habit_name.lower()} for 5 minutes",
                "unit": "minutes",
                "value": 5,
                "type": "time_based"
            }
    
    def get_next_difficulty_level(self, current_micro_habit: Dict[str, Any], habit_name: str) -> Optional[Dict[str, Any]]:
        """Get the next difficulty level for a micro-habit."""
        habit_name_lower = habit_name.lower()
        
        # Find matching template
        for template_name, template_data in self.habit_templates.items():
            for pattern in template_data["patterns"]:
                if pattern in habit_name_lower:
                    current_value = current_micro_habit.get("value", 0)
                    current_unit = current_micro_habit.get("unit", "")
                    
                    # Find current level and get next one
                    for i, level in enumerate(template_data["difficulty_levels"]):
                        if level["value"] == current_value and level["unit"] == current_unit:
                            if i + 1 < len(template_data["difficulty_levels"]):
                                return template_data["difficulty_levels"][i + 1]
                    break
        
        # If no template match or already at max level, increase current value
        current_value = current_micro_habit.get("value", 5)
        current_unit = current_micro_habit.get("unit", "minutes")
        
        if current_unit == "minutes":
            new_value = min(current_value + 5, 60)  # Cap at 60 minutes
        elif current_unit == "glasses":
            new_value = min(current_value + 1, 8)  # Cap at 8 glasses
        else:
            new_value = current_value + 1
        
        return {
            "task": f"{current_micro_habit.get('task', '').split(' for ')[0]} for {new_value} {current_unit}",
            "unit": current_unit,
            "value": new_value,
            "type": current_micro_habit.get("type", "time_based")
        }
    
    def get_previous_difficulty_level(self, current_micro_habit: Dict[str, Any], habit_name: str) -> Optional[Dict[str, Any]]:
        """Get the previous (easier) difficulty level for a micro-habit."""
        habit_name_lower = habit_name.lower()
        
        # Find matching template
        for template_name, template_data in self.habit_templates.items():
            for pattern in template_data["patterns"]:
                if pattern in habit_name_lower:
                    current_value = current_micro_habit.get("value", 0)
                    current_unit = current_micro_habit.get("unit", "")
                    
                    # Find current level and get previous one
                    for i, level in enumerate(template_data["difficulty_levels"]):
                        if level["value"] == current_value and level["unit"] == current_unit:
                            if i > 0:
                                return template_data["difficulty_levels"][i - 1]
                    break
        
        # If no template match or already at min level, decrease current value
        current_value = current_micro_habit.get("value", 5)
        current_unit = current_micro_habit.get("unit", "minutes")
        
        if current_unit == "minutes":
            new_value = max(current_value - 5, 1)  # Minimum 1 minute
        elif current_unit == "glasses":
            new_value = max(current_value - 1, 1)  # Minimum 1 glass
        else:
            new_value = max(current_value - 1, 1)
        
        return {
            "task": f"{current_micro_habit.get('task', '').split(' for ')[0]} for {new_value} {current_unit}",
            "unit": current_unit,
            "value": new_value,
            "type": current_micro_habit.get("type", "time_based")
        }

