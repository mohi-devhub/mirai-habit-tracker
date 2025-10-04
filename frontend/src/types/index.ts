// User types
export interface User {
  user_id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface UserProfile extends User {
  total_habits: number;
  active_habits: number;
  completion_rate: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Habit types
export interface MicroHabit {
  task: string;
  unit: string;
  value: number;
  type: "time_based" | "quantity_based";
}

export interface Habit {
  habit_id: string;
  user_id: string;
  habit_name: string;
  habit_category?: string;
  current_micro_habit?: MicroHabit;
  is_active: boolean;
  created_at: string;
}

export interface HabitWithStats extends Habit {
  completion_rate: number;
  streak_days: number;
  total_logs: number;
}

export interface HabitLog {
  log_id: string;
  habit_id: string;
  log_date: string;
  completed: boolean;
  micro_habit_details?: MicroHabit;
}

export interface TodayHabit {
  habit_id: string;
  habit_name: string;
  habit_category?: string;
  current_micro_habit?: MicroHabit;
  completed_today: boolean;
  log_id?: string;
}

export interface HabitInsights {
  total_days: number;
  completion_rate: number;
  current_streak: number;
  longest_streak: number;
  average_score: number;
  recommendation: string;
}

export interface HabitsState {
  habits: HabitWithStats[];
  todayHabits: TodayHabit[];
  selectedHabit: Habit | null;
  habitInsights: HabitInsights | null;
  isLoading: boolean;
  error: string | null;
}

// API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface CreateHabitRequest {
  habit_name: string;
  habit_category?: string;
}

export interface LogHabitRequest {
  habit_id: string;
  log_date: string;
  completed: boolean;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  Habits: undefined;
  Profile: undefined;
  HabitDetails: { habitId: string };
  CreateHabit: undefined;
};

// Mascot types
export interface MascotMessage {
  id: string;
  type: "celebration" | "encouragement" | "reminder" | "adjustment";
  title: string;
  message: string;
  emoji: string;
  timestamp: string;
}

export interface MascotState {
  currentMessage: MascotMessage | null;
  messageHistory: MascotMessage[];
  isVisible: boolean;
}
