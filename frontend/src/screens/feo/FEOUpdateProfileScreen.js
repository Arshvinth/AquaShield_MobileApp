import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import { feoAPI } from "../../services/api";
import { COLORS } from "../../utils/constants";

const FEOUpdateProfileScreen = ({ navigation }) => {
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    officeContact: "",
    profileImage: null,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await feoAPI.getFEOProfile();
      setFormData({
        fullName: response.data.fullName,
        officeContact: response.data.officeContact,
        profileImage: response.data.profileImage,
      });
      console.log("✅ FEO Profile loaded:", response.data);
    } catch (error) {
      console.error("❌ Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload images!"
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      setImageLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        console.log("📸 Image selected:", asset.uri);

        setFormData({
          ...formData,
          profileImage: {
            uri: asset.uri,
          },
        });

        Alert.alert("Success", "Image selected successfully");
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.fullName || !formData.officeContact) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Submitting FEO profile update...");
      const response = await feoAPI.updateFEOProfile(formData);

      console.log("✅ FEO Profile updated successfully:", response.data);
      await updateUserData(response.data);

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getImageUri = () => {
    if (formData.profileImage?.uri) {
      return formData.profileImage.uri;
    }
    if (formData.profileImage?.url) {
      return formData.profileImage.url;
    }
    return null;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UPDATE PROFILE</Text>
      </View>

      <View style={styles.avatarSection}>
        {getImageUri() ? (
          <Image
            source={{ uri: getImageUri() }}
            style={styles.avatar}
            onError={(e) => {
              console.error("Image load error:", e.nativeEvent.error);
            }}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="shield" size={60} color={COLORS.white} />
          </View>
        )}

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickImage}
          disabled={imageLoading}
        >
          {imageLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Icon name="camera" size={20} color={COLORS.white} />
              <Text style={styles.uploadButtonText}>Choose Photo</Text>
            </>
          )}
        </TouchableOpacity>

        {formData.profileImage?.uri && (
          <Text style={styles.imageSelectedText}>✓ New image selected</Text>
        )}
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={formData.fullName}
            onChangeText={(value) => handleInputChange("fullName", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Office Contact *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter office contact"
            value={formData.officeContact}
            onChangeText={(value) => handleInputChange("officeContact", value)}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.updateButton, loading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.updateButtonText}>Update Profile</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
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
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: COLORS.light,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 150,
    justifyContent: "center",
  },
  uploadButtonText: {
    color: COLORS.white,
    marginLeft: 8,
    fontWeight: "600",
  },
  imageSelectedText: {
    color: COLORS.success,
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
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
  updateButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  updateButtonText: {
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
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default FEOUpdateProfileScreen;
