import { apiService } from "./api";
import {
  HabitWithStats,
  CreateHabitRequest,
  LogHabitRequest,
  TodayHabit,
  HabitInsights,
  Habit,
} from "@/types";

class HabitsService {
  async getHabits(): Promise<HabitWithStats[]> {
    return apiService.get<HabitWithStats[]>("/habits");
  }

  async createHabit(habitData: CreateHabitRequest): Promise<Habit> {
    return apiService.post<Habit>("/habits", habitData);
  }

  async updateHabit(
    habitId: string,
    updates: Partial<CreateHabitRequest>
  ): Promise<HabitWithStats> {
    return apiService.put<HabitWithStats>(`/habits/${habitId}`, updates);
  }

  async deleteHabit(habitId: string): Promise<void> {
    return apiService.delete<void>(`/habits/${habitId}`);
  }

  async logHabit(logData: LogHabitRequest): Promise<any> {
    return apiService.post("/habits/log", logData);
  }

  async getTodayHabits(): Promise<TodayHabit[]> {
    return apiService.get<TodayHabit[]>("/habits/today");
  }

  async getHabitInsights(habitId: string): Promise<HabitInsights> {
    return apiService.get<HabitInsights>(`/habits/${habitId}/insights`);
  }

  async analyzeDifficulty(): Promise<{ message: string; adjustments: any[] }> {
    return apiService.post("/habits/analyze-difficulty");
  }
}

export const habitsService = new HabitsService();
