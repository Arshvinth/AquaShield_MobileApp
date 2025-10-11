import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../utils/constants";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await login({ email, password }, "user");
    setLoading(false);

    if (!result.success) {
      Alert.alert("Login Failed", result.message);
    }
  };

  const handleGoogleSignIn = () => {
    Alert.alert("Coming Soon", "Google Sign In will be implemented");
  };

  const handleFacebookSignIn = () => {
    Alert.alert("Coming Soon", "Facebook Sign In will be implemented");
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

      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Icon name="person" size={60} color={COLORS.white} />
        </View>
        <Text style={styles.welcomeText}>WELCOME BACK!</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password? Click here</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignIn}
        >
          <Icon name="logo-google" size={24} color={COLORS.danger} />
          <Text style={styles.socialButtonText}>Sign In with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleFacebookSignIn}
        >
          <Icon name="logo-facebook" size={24} color="#1877F2" />
          <Text style={styles.socialButtonText}>Sign In with Facebook</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.otherLogins}>
          <TouchableOpacity onPress={() => navigation.navigate("FEOLogin")}>
            <Text style={styles.otherLoginText}>FEO Login</Text>
          </TouchableOpacity>
          <Text style={styles.separator}> | </Text>
          <TouchableOpacity onPress={() => navigation.navigate("AdminLogin")}>
            <Text style={styles.otherLoginText}>Admin Login</Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.secondary,
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
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
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
  forgotPassword: {
    color: COLORS.primary,
    textAlign: "right",
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  dividerText: {
    marginHorizontal: 10,
    color: COLORS.gray,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.light,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: COLORS.gray,
  },
  signUpText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  otherLogins: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  otherLoginText: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
  separator: {
    color: COLORS.gray,
  },
});

export default LoginScreen;
