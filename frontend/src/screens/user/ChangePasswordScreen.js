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
import { userAPI, feoAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../utils/constants";

const ChangePasswordScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

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

  const handleChangePassword = async () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number or special character."
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      if (user?.userType === "feo") {
        await feoAPI.changeFEOPassword(data);
      } else {
        await userAPI.changePassword(data);
      }

      Alert.alert("Success", "Password changed successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to change password"
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
        <Text style={styles.title}>Reset Password to continue Again</Text>
      </View>

      <View style={styles.requirementsBox}>
        <Text style={styles.requirementsTitle}>Your new password:</Text>
        <Text style={styles.requirement}>
          • must be at least 8 characters long.
        </Text>
        <Text style={styles.requirement}>
          • must contain at least one upper case, one lower case letter.
        </Text>
        <Text style={styles.requirement}>
          • must contain at least one number or special character.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChangeText={(value) =>
                handleInputChange("currentPassword", value)
              }
              secureTextEntry={!showCurrentPassword}
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChangeText={(value) => handleInputChange("newPassword", value)}
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
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
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
          style={styles.submitButton}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
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
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  requirementsBox: {
    backgroundColor: COLORS.light,
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginBottom: 10,
  },
  requirement: {
    fontSize: 14,
    color: COLORS.primary,
    marginVertical: 3,
  },
  formContainer: {
    flex: 1,
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
  cancelButton: {
    backgroundColor: COLORS.light,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ChangePasswordScreen;
