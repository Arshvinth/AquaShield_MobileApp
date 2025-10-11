import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");

      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, loginType = "user") => {
    try {
      let response;

      if (loginType === "admin") {
        response = await authAPI.adminLogin(credentials);
      } else if (loginType === "feo") {
        response = await authAPI.feoLogin(credentials);
      } else {
        response = await authAPI.login(credentials);
      }

      const { token, ...userData } = response.data;

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, data: userData };
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        errorMessage =
          "Cannot connect to server. Please check your internet connection.";
      } else if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check if the backend is running.";
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log("=== Starting Registration ===");
      console.log("Registration data:", JSON.stringify(userData, null, 2));

      const response = await authAPI.register(userData);

      console.log("✅ Registration API call successful");
      console.log("Response data:", response.data);

      const { token, ...user } = response.data;

      if (!token) {
        throw new Error("No token received from server");
      }

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      console.log("✅ Registration complete");
      return { success: true, data: user };
    } catch (error) {
      console.error("❌ Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      // Network errors
      if (error.code === "ECONNREFUSED") {
        console.error("❌ Connection refused - Backend not running");
        errorMessage =
          "Cannot connect to server. Please ensure the backend is running on port 5000.";
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error"
      ) {
        console.error("❌ Network error");
        errorMessage =
          "Network error. Please check:\n1. Backend is running\n2. Firewall allows port 5000\n3. Using correct IP (10.0.2.2 for emulator)";
      }
      // Server responded with error
      else if (error.response) {
        console.error("❌ Server responded with error:", error.response.status);
        console.error("Error data:", error.response.data);

        if (error.response.status === 400) {
          errorMessage =
            error.response.data?.message || "Invalid registration data";
        } else if (error.response.status === 403) {
          errorMessage = error.response.data?.message || "Access forbidden. Please check server configuration.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please check backend logs.";
        } else {
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        }
      }
      // Request was made but no response
      else if (error.request) {
        console.error("❌ No response received");
        console.error("Request:", error.request);
        errorMessage = "No response from server. Backend may not be running.";
      }
      // Something else went wrong
      else {
        console.error("❌ Error:", error.message);
        errorMessage = error.message || "An unexpected error occurred";
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const updateUserData = async (newData) => {
    try {
      const updatedUser = { ...user, ...newData };
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
