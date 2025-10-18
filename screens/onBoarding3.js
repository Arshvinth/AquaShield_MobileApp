import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

const { width, height } = Dimensions.get("window");

const OnboardingScreen3 = ({ navigation }) => {
  const onSwipeRight = () => {
    navigation.navigate("OnBoarding2"); // go back to previous screen
  };

  const handleGetStarted = () => {
    navigation.navigate("Login"); // go to landing page
  };

  return (
    <GestureRecognizer
      onSwipeRight={onSwipeRight}
      config={{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      }}
      style={styles.container}
    >
      {/* Top Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../assets/AppImages/TopOnboard3.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Text Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Monitor & Manage Efficiently</Text>

        <View style={styles.bulletsContainer}>
          <Text style={styles.bullet}>• Secure, role-based access for users</Text>
          <Text style={styles.bullet}>• Visual analytics to guide decisions</Text>
          <Text style={styles.bullet}>• Real-time dashboards for authorities</Text>
          <Text style={styles.bullet}>• Track and resolve cases effectively</Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        {/* Get Started Button */}
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F1F1",
  },
  imageWrapper: {
    width: "100%",
    height: height * 0.4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: "#146C94",
    marginBottom: 20,
  },
  bulletsContainer: {
    marginTop: 20,
    width: "90%",
    marginBottom: 30,
  },
  bullet: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: "#333",
    textAlign: "",
    fontWeight: "500",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#146C94",
  },
  button: {
    backgroundColor: "#146C94",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OnboardingScreen3;
