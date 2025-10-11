import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import Layout from "../components/layout/layout";

const { width } = Dimensions.get("window");

const LaunchScreen = ({ navigation }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the progress bar from 0 to full in 3 seconds
    Animated.timing(progress, {
      toValue: 1,
      duration: 6000,
      useNativeDriver: false,
    }).start(() => {
      // Navigate to next screen after animation completes
      navigation.replace("onBoarding1"); // Replace "NextScreen" with your target screen name
    });
  }, []);

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 40], // width minus padding
  });

  return (
    
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/AppImages/AquaShieldLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.tagline}>
          “A safer sea, powered by you.”{"\n"}Report, monitor, and protect marine
          life!
        </Text>

        {/* Loader */}
        <View style={styles.loaderContainer}>
          <View style={styles.loaderBackground}>
            <Animated.View
              style={[styles.loaderFill, { width: progressBarWidth }]}
            />
          </View>
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#19A7CE",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    backgroundColor: "#F6F1F1",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  tagline: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 40,
  },
  loaderContainer: {
    width: "100%",
    alignItems: "center",
  },
  loaderBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#fff4",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  loaderFill: {
    height: 10,
    backgroundColor: "#fff",
  },
  loaderText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default LaunchScreen;
