import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTodayHabits, logHabit, optimisticUpdateTodayHabit } from "@/store/slices/habitsSlice";
import { useMascot } from "@/components/MascotProvider";
import { TodayHabit } from "@/types";

const DashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { showMascotMessage } = useMascot();
  const [refreshing, setRefreshing] = useState(false);

  const { todayHabits, isLoading } = useAppSelector((state) => state.habits);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTodayHabits());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchTodayHabits());
    setRefreshing(false);
  };

  const handleHabitToggle = async (habit: TodayHabit) => {
    const newCompletedStatus = !habit.completed_today;

    // Optimistic update - update UI immediately
    dispatch(optimisticUpdateTodayHabit({
      habit_id: habit.habit_id,
      completed: newCompletedStatus,
    }));

    // Show mascot message immediately
    if (newCompletedStatus) {
      showMascotMessage({
        id: Date.now().toString(),
        type: "celebration",
        title: "Great Job! 🎉",
        message: `You completed "${habit.habit_name}"! Keep up the amazing work!`,
        emoji: "🎉",
        timestamp: new Date().toISOString(),
      });
    }

    try {
      await dispatch(
        logHabit({
          habit_id: habit.habit_id,
          log_date: new Date().toISOString().split("T")[0],
          completed: newCompletedStatus,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to log habit:", error);
      // Revert optimistic update on error
      dispatch(optimisticUpdateTodayHabit({
        habit_id: habit.habit_id,
        completed: !newCompletedStatus,
      }));
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const completedCount = todayHabits.filter(
    (habit) => habit.completed_today
  ).length;
  const totalCount = todayHabits.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user?.full_name || "User"}!</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile" as never)}
        >
          <Icon name="person" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Today's Progress</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {totalCount > 0
                ? Math.round((completedCount / totalCount) * 100)
                : 0}
              %
            </Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Micro-Habits</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("CreateHabit" as never)}
          >
            <Icon name="add" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {todayHabits.length === 0 ? (
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
          todayHabits.map((habit) => (
            <View key={habit.habit_id} style={styles.habitCard}>
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.habit_name}</Text>
                {habit.current_micro_habit && (
                  <Text style={styles.microHabit}>
                    {habit.current_micro_habit.task}
                  </Text>
                )}
                {habit.habit_category && (
                  <Text style={styles.habitCategory}>
                    {habit.habit_category}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  habit.completed_today && styles.checkButtonCompleted,
                ]}
                onPress={() => handleHabitToggle(habit)}
              >
                <Icon
                  name={
                    habit.completed_today ? "check" : "radio-button-unchecked"
                  }
                  size={24}
                  color={habit.completed_today ? "#ffffff" : "#6366f1"}
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
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
  greeting: {
    fontSize: 16,
    color: "#6b7280",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  profileButton: {
    padding: 8,
  },
  statsCard: {
    backgroundColor: "#ffffff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6366f1",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
  },
  addButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    padding: 48,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginTop: 16,
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  microHabit: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  habitCategory: {
    fontSize: 12,
    color: "#9ca3af",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  checkButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  checkButtonCompleted: {
    backgroundColor: "#6366f1",
  },
});

export default DashboardScreen;
