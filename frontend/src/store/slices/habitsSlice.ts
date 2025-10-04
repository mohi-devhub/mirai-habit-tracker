import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  HabitsState,
  HabitWithStats,
  Habit,
  CreateHabitRequest,
  LogHabitRequest,
  TodayHabit,
  HabitInsights,
} from "@/types";
import { habitsService } from "@/services/habitsService";

const initialState: HabitsState = {
  habits: [],
  todayHabits: [],
  selectedHabit: null,
  habitInsights: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchHabits = createAsyncThunk(
  "habits/fetchHabits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await habitsService.getHabits();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch habits"
      );
    }
  }
);

export const createHabit = createAsyncThunk(
  "habits/createHabit",
  async (habitData: CreateHabitRequest, { rejectWithValue }) => {
    try {
      const response = await habitsService.createHabit(habitData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to create habit"
      );
    }
  }
);

export const updateHabit = createAsyncThunk(
  "habits/updateHabit",
  async (
    {
      habitId,
      updates,
    }: { habitId: string; updates: Partial<CreateHabitRequest> },
    { rejectWithValue }
  ) => {
    try {
      const response = await habitsService.updateHabit(habitId, updates);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to update habit"
      );
    }
  }
);

export const deleteHabit = createAsyncThunk(
  "habits/deleteHabit",
  async (habitId: string, { rejectWithValue }) => {
    try {
      await habitsService.deleteHabit(habitId);
      return habitId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to delete habit"
      );
    }
  }
);

export const logHabit = createAsyncThunk(
  "habits/logHabit",
  async (logData: LogHabitRequest, { rejectWithValue }) => {
    try {
      const response = await habitsService.logHabit(logData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to log habit"
      );
    }
  }
);

export const fetchTodayHabits = createAsyncThunk(
  "habits/fetchTodayHabits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await habitsService.getTodayHabits();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch today's habits"
      );
    }
  }
);

export const fetchHabitInsights = createAsyncThunk(
  "habits/fetchHabitInsights",
  async (habitId: string, { rejectWithValue }) => {
    try {
      const response = await habitsService.getHabitInsights(habitId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch habit insights"
      );
    }
  }
);

export const analyzeDifficulty = createAsyncThunk(
  "habits/analyzeDifficulty",
  async (_, { rejectWithValue }) => {
    try {
      const response = await habitsService.analyzeDifficulty();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to analyze difficulty"
      );
    }
  }
);

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    setSelectedHabit: (state, action: PayloadAction<string | null>) => {
      const habit = state.habits.find((h) => h.habit_id === action.payload);
      state.selectedHabit = habit || null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateHabitInList: (state, action: PayloadAction<HabitWithStats>) => {
      const index = state.habits.findIndex(
        (h) => h.habit_id === action.payload.habit_id
      );
      if (index !== -1) {
        state.habits[index] = action.payload;
      }
    },
    optimisticUpdateTodayHabit: (state, action: PayloadAction<{ habit_id: string; completed: boolean }>) => {
      const index = state.todayHabits.findIndex(
        (h) => h.habit_id === action.payload.habit_id
      );
      if (index !== -1) {
        state.todayHabits[index].completed_today = action.payload.completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch habits
      .addCase(fetchHabits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.habits = action.payload;
        state.error = null;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create habit
      .addCase(createHabit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
.addCase(createHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        const created = action.payload as unknown as Habit; // backend returns Habit
        const withStats: HabitWithStats = {
          ...(created as any),
          completion_rate: 0,
          streak_days: 0,
          total_logs: 0,
        };
        state.habits.push(withStats);
        state.error = null;
      })
      .addCase(createHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update habit
      .addCase(updateHabit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.habits.findIndex(
          (h) => h.habit_id === action.payload.habit_id
        );
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete habit
      .addCase(deleteHabit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.habits = state.habits.filter(
          (h) => h.habit_id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Log habit
      .addCase(logHabit.fulfilled, (state, action) => {
        // Update today's habits
        const todayHabitIndex = state.todayHabits.findIndex(
          (h) => h.habit_id === action.payload.habit_id
        );
        if (todayHabitIndex !== -1) {
          state.todayHabits[todayHabitIndex].completed_today =
            action.payload.completed;
          state.todayHabits[todayHabitIndex].log_id = action.payload.log_id;
        }
      })
      // Fetch today's habits
      .addCase(fetchTodayHabits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodayHabits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayHabits = action.payload;
        state.error = null;
      })
      .addCase(fetchTodayHabits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch habit insights
      .addCase(fetchHabitInsights.fulfilled, (state, action) => {
        state.habitInsights = action.payload;
      })
      // Analyze difficulty
      .addCase(analyzeDifficulty.fulfilled, (state, action) => {
        // Refresh habits after difficulty analysis
        // This will be handled by refetching habits
      });
  },
});

export const { setSelectedHabit, clearError, updateHabitInList, optimisticUpdateTodayHabit } =
  habitsSlice.actions;
export default habitsSlice.reducer;
