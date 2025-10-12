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
import Icon from "react-native-vector-icons/Ionicons";
import { feoAPI } from "../../services/api";
import { COLORS, DEPARTMENTS } from "../../utils/constants";

const AddFEOScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
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
    profileImage: null,
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
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

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        profileImage: {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          fileName: "profile.jpg",
        },
      });
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
      const dataToSend = { ...formData };
      delete dataToSend.confirmPassword;

      console.log("Submitting FEO data:", {
        ...dataToSend,
        password: "[HIDDEN]",
      });

      const response = await feoAPI.createFEO(dataToSend);

      console.log("FEO created successfully:", response.data);

      Alert.alert("Success", "FEO Officer added successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error creating FEO:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add FEO officer";

      Alert.alert("Error", errorMessage);
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
          {formData.profileImage ? (
            <Image
              source={{ uri: formData.profileImage.uri }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={40} color={COLORS.gray} />
            </View>
          )}
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>Choose file</Text>
          </TouchableOpacity>
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
