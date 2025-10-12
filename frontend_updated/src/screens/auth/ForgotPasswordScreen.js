// frontend/src/screens/auth/ForgotPasswordScreen.js
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

const ForgotPasswordScreen = ({ route, navigation }) => {
  const { userType = "user" } = route.params || {};
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const getTitle = () => {
    switch (userType) {
      case "feo":
        return "FEO Password Reset";
      case "admin":
        return "Admin Password Reset";
      default:
        return "Forgot Password";
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.forgotPassword(email, userType);

      Alert.alert(
        "Success",
        "Password reset instructions have been sent to your email address. Please check your inbox.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("ResetPassword", {
                resetToken: response.data.resetToken,
                userType,
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Forgot password error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to send reset email. Please try again."
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
          <Icon name="lock-closed" size={60} color={COLORS.white} />
        </View>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your
          password.
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="mail-outline"
                size={20}
                color={COLORS.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={18} color={COLORS.primary} />
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Icon
          name="information-circle-outline"
          size={20}
          color={COLORS.primary}
        />
        <Text style={styles.infoText}>
          Didn't receive the email? Check your spam folder or try again after a
          few minutes.
        </Text>
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
    backgroundColor: COLORS.primary,
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
    marginBottom: 30,
    lineHeight: 24,
  },
  formContainer: {
    marginTop: 20,
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  backToLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  backToLoginText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: COLORS.light,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
});

export default ForgotPasswordScreen;
