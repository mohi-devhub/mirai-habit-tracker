import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons as Icon } from "@expo/vector-icons";

import { useAppSelector } from "@/store";
import { RootStackParamList } from "@/types";

// Auth Screens
import LoginScreen from "@/screens/auth/LoginScreen";
import SignupScreen from "@/screens/auth/SignupScreen";

// Main Screens
import DashboardScreen from "@/screens/main/DashboardScreen";
import HabitsScreen from "@/screens/main/HabitsScreen";
import ProfileScreen from "@/screens/main/ProfileScreen";
import HabitDetailsScreen from "@/screens/main/HabitDetailsScreen";
import CreateHabitScreen from "@/screens/main/CreateHabitScreen";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        switch (route.name) {
          case "Dashboard":
            iconName = "dashboard";
            break;
          case "Habits":
            iconName = "check-circle";
            break;
          case "Profile":
            iconName = "person";
            break;
          default:
            iconName = "help";
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#6366f1",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Habits" component={HabitsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Main"
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="HabitDetails"
      component={HabitDetailsScreen}
      options={{ title: "Habit Details" }}
    />
    <Stack.Screen
      name="CreateHabit"
      component={CreateHabitScreen}
      options={{ title: "Create Habit" }}
    />
  </Stack.Navigator>
);

const AppNavigator: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
