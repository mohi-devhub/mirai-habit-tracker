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
import { useRoute, RouteProp } from "@react-navigation/native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchHabitInsights,
  analyzeDifficulty,
} from "@/store/slices/habitsSlice";
import { RootStackParamList } from "@/types";

type HabitDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "HabitDetails"
>;

const HabitDetailsScreen: React.FC = () => {
  const route = useRoute<HabitDetailsScreenRouteProp>();
  const { habitId } = route.params;
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { habits, habitInsights, isLoading } = useAppSelector(
    (state) => state.habits
  );

  const habit = habits.find((h) => h.habit_id === habitId);

  useEffect(() => {
    if (habitId) {
      dispatch(fetchHabitInsights(habitId));
    }
  }, [dispatch, habitId]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (habitId) {
      await dispatch(fetchHabitInsights(habitId));
    }
    setRefreshing(false);
  };

  const handleAnalyzeDifficulty = async () => {
    try {
      const result = await dispatch(analyzeDifficulty()).unwrap();
      Alert.alert("Analysis Complete", result.message, [{ text: "OK" }]);
      // Refresh insights after analysis
      if (habitId) {
        dispatch(fetchHabitInsights(habitId));
      }
    } catch (error: any) {
      Alert.alert("Error", error || "Failed to analyze difficulty");
    }
  };

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Habit not found</Text>
      </View>
    );
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "#10b981";
    if (streak >= 3) return "#f59e0b";
    return "#ef4444";
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 0.8) return "#10b981";
    if (rate >= 0.6) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.habitName}>{habit.habit_name}</Text>
        {habit.habit_category && (
          <Text style={styles.habitCategory}>{habit.habit_category}</Text>
        )}
      </View>

      {habit.current_micro_habit && (
        <View style={styles.microHabitCard}>
          <Text style={styles.microHabitTitle}>Current Micro-Habit</Text>
          <Text style={styles.microHabitText}>
            {habit.current_micro_habit.task}
          </Text>
          <View style={styles.microHabitDetails}>
            <Text style={styles.microHabitDetail}>
              Duration: {habit.current_micro_habit.value}{" "}
              {habit.current_micro_habit.unit}
            </Text>
            <Text style={styles.microHabitDetail}>
              Type: {habit.current_micro_habit.type.replace("_", " ")}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Performance Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon
              name="trending-up"
              size={24}
              color={getStreakColor(habit.streak_days)}
            />
            <Text style={styles.statNumber}>{habit.streak_days}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Icon
              name="check-circle"
              size={24}
              color={getCompletionRateColor(habit.completion_rate)}
            />
            <Text style={styles.statNumber}>
              {Math.round(habit.completion_rate * 100)}%
            </Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="history" size={24} color="#6366f1" />
            <Text style={styles.statNumber}>{habit.total_logs}</Text>
            <Text style={styles.statLabel}>Total Logs</Text>
          </View>
        </View>
      </View>

      {habitInsights && (
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <View style={styles.insightsCard}>
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Total Days Tracked</Text>
              <Text style={styles.insightValue}>
                {habitInsights.total_days}
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Longest Streak</Text>
              <Text style={styles.insightValue}>
                {habitInsights.longest_streak} days
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Average Score</Text>
              <Text style={styles.insightValue}>
                {habitInsights.average_score.toFixed(1)}
              </Text>
            </View>
            <View style={styles.recommendationContainer}>
              <Text style={styles.recommendationLabel}>AI Recommendation</Text>
              <Text style={styles.recommendationText}>
                {habitInsights.recommendation}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleAnalyzeDifficulty}
          >
            <Icon name="analytics" size={20} color="#6366f1" />
            <Text style={styles.actionText}>Analyze Difficulty</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Icon name="edit" size={20} color="#6366f1" />
            <Text style={styles.actionText}>Edit Habit</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Icon name="pause" size={20} color="#f59e0b" />
            <Text style={styles.actionText}>
              {habit.is_active ? "Pause Habit" : "Resume Habit"}
            </Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Created on {new Date(habit.created_at).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  habitName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  habitCategory: {
    fontSize: 16,
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  microHabitCard: {
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
  microHabitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  microHabitText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  microHabitDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  microHabitDetail: {
    fontSize: 14,
    color: "#6b7280",
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  insightsSection: {
    padding: 16,
  },
  insightsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  insightLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  insightValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  recommendationContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  recommendationLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  actionsSection: {
    padding: 16,
  },
  actionsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  actionText: {
    fontSize: 16,
    color: "#1f2937",
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    alignItems: "center",
    padding: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginTop: 48,
  },
});

export default HabitDetailsScreen;
