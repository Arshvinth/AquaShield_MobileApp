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
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Icon from "react-native-vector-icons/Ionicons";
import { feoAPI } from "../../services/api";
import { COLORS, DEPARTMENTS } from "../../utils/constants";

const AddFEOScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    designation: "",
    employeeId: "",
    assignedArea: "",
    nicNo: "",
    email: "",
    officeContact: "",
    password: "",
    confirmPassword: "",
    profileImageBase64: null, // NEW: Store Base64 string
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // NEW: Convert image to Base64 using ImageManipulator
  const convertImageToBase64 = async (uri) => {
    try {
      // Manipulate image and get Base64
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 500, height: 500 } }], // Resize to 500x500
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true, // Request Base64 output
        }
      );

      return manipResult.base64;
    } catch (error) {
      console.error("Error converting image to Base64:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions!"
      );
      return;
    }

    setImageLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        console.log("📸 Image selected:", asset.uri);

        // Convert to Base64
        const base64String = await convertImageToBase64(asset.uri);
        console.log("✅ Image converted to Base64");

        setFormData({
          ...formData,
          profileImageBase64: base64String,
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

  const handleSubmit = async () => {
    // Validation
    const missingFields = [];

    if (!formData.fullName) missingFields.push("Full Name");
    if (!formData.department) missingFields.push("Department");
    if (!formData.designation) missingFields.push("Designation");
    if (!formData.employeeId) missingFields.push("Employee ID");
    if (!formData.assignedArea) missingFields.push("Assigned Area");
    if (!formData.nicNo) missingFields.push("NIC Number");
    if (!formData.email) missingFields.push("Email");
    if (!formData.officeContact) missingFields.push("Office Contact");
    if (!formData.password) missingFields.push("Password");

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Fields",
        `Please fill in: ${missingFields.join(", ")}`
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // Prepare data to send (with Base64 image)
      const dataToSend = {
        fullName: formData.fullName,
        department: formData.department,
        designation: formData.designation,
        employeeId: formData.employeeId,
        assignedArea: formData.assignedArea,
        nicNo: formData.nicNo,
        email: formData.email,
        officeContact: formData.officeContact,
        password: formData.password,
      };

      // Add Base64 image if exists
      if (formData.profileImageBase64) {
        dataToSend.profileImageBase64 = formData.profileImageBase64;
      }

      console.log("Submitting FEO data with Base64...");

      const response = await feoAPI.createFEO(dataToSend);

      console.log("FEO created successfully:", response.data);

      Alert.alert("Success", "FEO Officer added successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error creating FEO:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add FEO officer";

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getImageUri = () => {
    if (formData.profileImageBase64) {
      return `data:image/jpeg;base64,${formData.profileImageBase64}`;
    }
    return null;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          ADD FISHERIES ENFORCEMENT OFFICER
        </Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="log-out-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="trash-outline" size={24} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.avatarSection}>
          {getImageUri() ? (
            <Image source={{ uri: getImageUri() }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={40} color={COLORS.gray} />
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
              <Text style={styles.uploadButtonText}>Choose file</Text>
            )}
          </TouchableOpacity>
          {formData.profileImageBase64 && (
            <Text style={styles.imageSelectedText}>✓ Image ready</Text>
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.fullName}
          onChangeText={(value) => handleInputChange("fullName", value)}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.department}
            onValueChange={(value) => handleInputChange("department", value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Department" value="" />
            {DEPARTMENTS.map((dept) => (
              <Picker.Item key={dept} label={dept} value={dept} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Designation"
          value={formData.designation}
          onChangeText={(value) => handleInputChange("designation", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="EmployeeID"
          value={formData.employeeId}
          onChangeText={(value) => handleInputChange("employeeId", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Assigned Area"
          value={formData.assignedArea}
          onChangeText={(value) => handleInputChange("assignedArea", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="NIC No"
          value={formData.nicNo}
          onChangeText={(value) => handleInputChange("nicNo", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Office Contact"
          value={formData.officeContact}
          onChangeText={(value) => handleInputChange("officeContact", value)}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>Add FEO</Text>
          )}
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
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
    gap: 15,
  },
  formContainer: {
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.light,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: COLORS.gray,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 14,
  },
  imageSelectedText: {
    color: COLORS.success,
    marginTop: 5,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: COLORS.white,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: COLORS.white,
  },
  picker: {
    height: 50,
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
});

export default AddFEOScreen;
