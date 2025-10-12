import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../utils/constants";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import FEOLoginScreen from "../screens/auth/FEOLoginScreen";
import AdminLoginScreen from "../screens/auth/AdminLoginScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";

// User Screens
import UserProfileScreen from "../screens/user/UserProfileScreen";
import UpdateProfileScreen from "../screens/user/UpdateProfileScreen";
import ChangePasswordScreen from "../screens/user/ChangePasswordScreen";

// FEO Screens
import FEOProfileScreen from "../screens/feo/FEOProfileScreen";
import FEOUpdateProfileScreen from "../screens/feo/FEOUpdateProfileScreen";

// Admin Screens
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AddFEOScreen from "../screens/admin/AddFEOScreen";
import FEOListScreen from "../screens/admin/FEOListScreen";
import UpdateFEOScreen from "../screens/admin/UpdateFEOScreen";
import UserListScreen from "../screens/admin/UserListScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack - UPDATED with password reset screens
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{ title: "Create Account" }}
    />
    <Stack.Screen
      name="FEOLogin"
      component={FEOLoginScreen}
      options={{ title: "FEO Sign In" }}
    />
    <Stack.Screen
      name="AdminLogin"
      component={AdminLoginScreen}
      options={{ title: "Admin Sign In" }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{ title: "Forgot Password", headerShown: false }}
    />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPasswordScreen}
      options={{ title: "Reset Password", headerShown: false }}
    />
  </Stack.Navigator>
);

// User Tab Navigator
const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Profile") {
          iconName = focused ? "person" : "person-outline";
        } else if (route.name === "Settings") {
          iconName = focused ? "settings" : "settings-outline";
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray,
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold" },
    })}
  >
    <Tab.Screen name="Profile" component={UserProfileScreen} />
  </Tab.Navigator>
);

// User Stack
const UserStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="UserTabs"
      component={UserTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="UpdateProfile"
      component={UpdateProfileScreen}
      options={{ title: "Update Profile" }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{ title: "Change Password" }}
    />
  </Stack.Navigator>
);

// FEO Stack
const FEOStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="FEOProfile"
      component={FEOProfileScreen}
      options={{ title: "My Profile" }}
    />
    <Stack.Screen
      name="FEOUpdateProfile"
      component={FEOUpdateProfileScreen}
      options={{ title: "Update Profile" }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{ title: "Change Password" }}
    />
  </Stack.Navigator>
);

// Admin Tab Navigator
const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Dashboard") {
          iconName = focused ? "grid" : "grid-outline";
        } else if (route.name === "FEOList") {
          iconName = focused ? "people" : "people-outline";
        } else if (route.name === "UserList") {
          iconName = focused ? "person" : "person-outline";
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray,
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold" },
    })}
  >
    <Tab.Screen
      name="Dashboard"
      component={AdminDashboardScreen}
      options={{ title: "Dashboard" }}
    />
    <Tab.Screen
      name="FEOList"
      component={FEOListScreen}
      options={{ title: "FEO Officers" }}
    />
    <Tab.Screen
      name="UserList"
      component={UserListScreen}
      options={{ title: "Users" }}
    />
  </Tab.Navigator>
);

// Admin Stack
const AdminStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="AdminTabs"
      component={AdminTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddFEO"
      component={AddFEOScreen}
      options={{ title: "Add FEO Officer" }}
    />
    <Stack.Screen
      name="UpdateFEO"
      component={UpdateFEOScreen}
      options={{ title: "Update FEO Officer" }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  const getMainStack = () => {
    if (!isAuthenticated) {
      return <AuthStack />;
    }

    if (user?.role === "admin") {
      return <AdminStack />;
    }

    if (user?.userType === "feo") {
      return <FEOStack />;
    }

    return <UserStack />;
  };

  return <NavigationContainer>{getMainStack()}</NavigationContainer>;
};

export default AppNavigator;
