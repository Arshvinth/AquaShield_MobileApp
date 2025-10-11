import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

const { width, height } = Dimensions.get("window");

const OnboardingScreen2 = ({ navigation }) => {
  const onSwipeLeft = () => {
    navigation.navigate("onBoarding3"); // go to next screen
  };

  const onSwipeRight = () => {
    navigation.navigate("onBoarding1"); // go back to previous screen
  };

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      }}
      style={styles.container}
    >
      {/* Fullscreen Image at Top */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../assets/AppImages/TopOnboard2.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Research & Discover</Text>

        <View style={styles.bulletsContainer}>
          <Text style={styles.bullet}>
            • Attach photos, videos, or documents
          </Text>
          <Text style={styles.bullet}>
            • Export reports for deeper analysis
          </Text>
          <Text style={styles.bullet}>
            • Save favorite species & request new entries
          </Text>
          <Text style={styles.bullet}>
            • Receive real-time notifications for updates
          </Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
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
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: "#333",
    textAlign: "",
    fontWeight:500
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

export default OnboardingScreen2;
