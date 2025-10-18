import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const onSwipeLeft = () => {
    navigation.navigate("OnBoarding2"); // navigate to next screen
  };

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      config={{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      }}
      style={styles.container}
    >
      {/* Fullscreen Image at Top */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../assets/AppImages/TopOnboard1.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Report Illegal Fishing in Seconds</Text>

        <View style={styles.bulletsContainer}>
          <Text style={styles.bullet}>
            • Capture and upload photos, videos, or evidence with ease
          </Text>
          <Text style={styles.bullet}>
            • Automatic location tagging ensures accurate reporting
          </Text>
          <Text style={styles.bullet}>
            • Receive instant confirmation once your report is submitted
          </Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
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
    marginTop:30,
    width: "90%",
    marginBottom: 40,
  },
  bullet: {
    fontWeight:500,
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: "#333",
    textAlign: "",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
});

export default OnboardingScreen;
