import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout, getCurrentUser } from "@/store/slices/authSlice";
import { UserProfile } from "@/types";

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="person" size={48} color="#6366f1" />
        </View>
        <Text style={styles.userName}>{user.full_name || "User"}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {(user as UserProfile)?.total_habits || 0}
            </Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {(user as UserProfile)?.active_habits || 0}
            </Text>
            <Text style={styles.statLabel}>Active Habits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Math.round(((user as UserProfile)?.completion_rate || 0) * 100)}%
            </Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Icon name="person" size={20} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>
                {user.full_name || "Not set"}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Icon name="calendar-today" size={20} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {formatDate(user.created_at)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionItem}>
            <Icon name="settings" size={20} color="#6b7280" />
            <Text style={styles.actionText}>Settings</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Icon name="help" size={20} color="#6b7280" />
            <Text style={styles.actionText}>Help & Support</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Icon name="info" size={20} color="#6b7280" />
            <Text style={styles.actionText}>About</Text>
            <Icon name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Mirai - Adaptive Micro-Habit App</Text>
        <Text style={styles.footerText}>Version 1.0.0</Text>
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
    backgroundColor: "#ffffff",
    alignItems: "center",
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  infoSection: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
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
  logoutSection: {
    padding: 16,
  },
  logoutButton: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    padding: 32,
  },
  footerText: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 4,
  },
});

export default ProfileScreen;
