import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "@/store";
import { createHabit, fetchHabits } from "@/store/slices/habitsSlice";
import { useMascot } from "@/components/MascotProvider";

const CreateHabitScreen: React.FC = () => {
  const [habitName, setHabitName] = useState("");
  const [habitCategory, setHabitCategory] = useState("");
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { showMascotMessage } = useMascot();
  const { isLoading } = useAppSelector((state) => state.habits);

  const categories = [
    "Health & Fitness",
    "Learning & Education",
    "Productivity",
    "Mindfulness",
    "Social",
    "Creative",
    "Other",
  ];

  const handleCreateHabit = async () => {
    if (!habitName.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    try {
      const newHabit = await dispatch(
        createHabit({
          habit_name: habitName.trim(),
          habit_category: habitCategory || undefined,
        })
      ).unwrap();

      // Show success message with mascot
      showMascotMessage({
        id: Date.now().toString(),
        type: "celebration",
        title: "Habit Created! 🎉",
        message: `Great! You've created "${newHabit.habit_name}". Your micro-habit journey begins now!`,
        emoji: "🚀",
        timestamp: new Date().toISOString(),
      });

      // Refresh habits list
      dispatch(fetchHabits());

      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error || "Failed to create habit");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Habit</Text>
          <Text style={styles.subtitle}>
            Start building a positive routine with micro-habits
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Habit Name *</Text>
            <TextInput
              style={styles.input}
              value={habitName}
              onChangeText={setHabitName}
              placeholder="e.g., Exercise more, Read daily, Meditate"
              autoCapitalize="words"
            />
            <Text style={styles.helpText}>
              Describe the habit you want to build in simple terms
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category (Optional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    habitCategory === category && styles.categoryChipSelected,
                  ]}
                  onPress={() => setHabitCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      habitCategory === category &&
                        styles.categoryChipTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>What happens next?</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewText}>
                ✨ Our AI will create a starting micro-habit for you
              </Text>
              <Text style={styles.previewText}>
                📊 We'll track your progress and adjust difficulty automatically
              </Text>
              <Text style={styles.previewText}>
                🎯 You'll get daily reminders and motivational messages
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleCreateHabit}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Creating Habit..." : "Create Habit"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  helpText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoryChip: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryChipSelected: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  categoryChipTextSelected: {
    color: "#ffffff",
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  previewText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateHabitScreen;
