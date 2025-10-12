// frontend/src/screens/auth/ResetPasswordScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { authAPI } from "../../services/api";
import { COLORS } from "../../utils/constants";

const ResetPasswordScreen = ({ route, navigation }) => {
  const { resetToken, userType = "user" } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      minLength && hasUpperCase && hasLowerCase && (hasNumber || hasSpecialChar)
    );
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number or special character."
      );
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(resetToken, newPassword, userType);

      Alert.alert(
        "Success",
        "Your password has been reset successfully. You can now login with your new password.",
        [
          {
            text: "OK",
            onPress: () => {
              if (userType === "feo") {
                navigation.navigate("FEOLogin");
              } else if (userType === "admin") {
                navigation.navigate("AdminLogin");
              } else {
                navigation.navigate("Login");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Reset password error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to reset password. The link may have expired. Please request a new reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Icon name="shield-checkmark" size={60} color={COLORS.white} />
        </View>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Please enter your new password. Make sure it's strong and secure.
        </Text>

        <View style={styles.requirementsBox}>
          <Text style={styles.requirementsTitle}>Your password must:</Text>
          <View style={styles.requirementRow}>
            <Icon
              name="checkmark-circle-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.requirement}>
              Be at least 8 characters long
            </Text>
          </View>
          <View style={styles.requirementRow}>
            <Icon
              name="checkmark-circle-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.requirement}>
              Contain at least one uppercase letter
            </Text>
          </View>
          <View style={styles.requirementRow}>
            <Icon
              name="checkmark-circle-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.requirement}>
              Contain at least one lowercase letter
            </Text>
          </View>
          <View style={styles.requirementRow}>
            <Icon
              name="checkmark-circle-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.requirement}>
              Contain at least one number or special character
            </Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.resetButton, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.resetButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.success,
    justifyContent: "center",
    alignItems: "center",
  },
  contentSection: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  requirementsBox: {
    backgroundColor: COLORS.light,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 10,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  requirement: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
  },
  formContainer: {
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.dark,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  resetButton: {
    backgroundColor: COLORS.success,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default ResetPasswordScreen;
