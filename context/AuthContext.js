// frontend/src/context/AuthContext.js
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

  const login = async (credentials, userType = "user") => {
    try {
      const endpoint =
        userType === "feo"
          ? "/auth/feo-login"
          : userType === "admin"
          ? "/auth/admin-login"
          : "/auth/login";

      let response;
      if (endpoint === "/auth/login") {
        response = await authAPI.login(credentials);
      } else if (endpoint === "/auth/feo-login") {
        response = await authAPI.feoLogin(credentials);
      } else if (endpoint === "/auth/admin-login") {
        response = await authAPI.adminLogin(credentials);
      }

      console.log("🔐 Login response:", response.data);

      // ✅ Handle nested structure safely
      const token = response.data?.token;
      const userData =
        response.data?.user?.user || response.data?.user || response.data;

      if (!token || !userData) {
        console.error("Missing token or user in response:", response.data);
        throw new Error("Invalid login response");
      }

      // ✅ Save clean user and token
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      if (response.data?.token && response.data?.user) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(response.data.user)
        );

        setUser(response.data.user);
        setIsAuthenticated(true);

        return {
          success: true,
          token: response.data.token,
          user: response.data.user,
        };
      } else {
        return { success: false, message: "Invalid registration response" };
      }
    } catch (error) {
      console.log("Registration error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
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
