import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchHabits, deleteHabit } from "@/store/slices/habitsSlice";
import { HabitWithStats } from "@/types";

const HabitsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const { habits, isLoading } = useAppSelector((state) => state.habits);

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchHabits());
    setRefreshing(false);
  };

  const handleDeleteHabit = (habit: HabitWithStats) => {
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habit.habit_name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => dispatch(deleteHabit(habit.habit_id)),
        },
      ]
    );
  };

  const handleHabitPress = (habit: HabitWithStats) => {
    navigation.navigate(
      "HabitDetails" as never,
      { habitId: habit.habit_id } as never
    );
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "#10b981"; // Green
    if (streak >= 3) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 0.8) return "#10b981"; // Green
    if (rate >= 0.6) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("CreateHabit" as never)}
        >
          <Icon name="add" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="check-circle-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first habit to start building positive routines!
          </Text>
          <TouchableOpacity
            style={styles.createFirstButton}
            onPress={() => navigation.navigate("CreateHabit" as never)}
          >
            <Text style={styles.createFirstButtonText}>
              Create Your First Habit
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        habits.map((habit) => (
          <TouchableOpacity
            key={habit.habit_id}
            style={styles.habitCard}
            onPress={() => handleHabitPress(habit)}
          >
            <View style={styles.habitHeader}>
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.habit_name}</Text>
                {habit.habit_category && (
                  <Text style={styles.habitCategory}>
                    {habit.habit_category}
                  </Text>
                )}
              </View>
              <View style={styles.habitActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteHabit(habit)}
                >
                  <Icon name="delete" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>

            {habit.current_micro_habit && (
              <View style={styles.microHabitContainer}>
                <Text style={styles.microHabitLabel}>Current Micro-Habit:</Text>
                <Text style={styles.microHabitText}>
                  {habit.current_micro_habit.task}
                </Text>
              </View>
            )}

            <View style={styles.habitStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Streak</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: getStreakColor(habit.streak_days) },
                  ]}
                >
                  {habit.streak_days} days
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Completion Rate</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: getCompletionRateColor(habit.completion_rate) },
                  ]}
                >
                  {Math.round(habit.completion_rate * 100)}%
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Logs</Text>
                <Text style={styles.statValue}>{habit.total_logs}</Text>
              </View>
            </View>

            <View style={styles.habitFooter}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: habit.is_active ? "#10b981" : "#6b7280" },
                ]}
              >
                <Text style={styles.statusText}>
                  {habit.is_active ? "Active" : "Paused"}
                </Text>
              </View>
              <Text style={styles.createdDate}>
                Created {new Date(habit.created_at).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  addButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    padding: 48,
    backgroundColor: "#ffffff",
    margin: 16,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  createFirstButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createFirstButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  habitCard: {
    backgroundColor: "#ffffff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  habitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  habitCategory: {
    fontSize: 14,
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  habitActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
  },
  microHabitContainer: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  microHabitLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  microHabitText: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },
  habitStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  habitFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },
  createdDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
});

export default HabitsScreen;
