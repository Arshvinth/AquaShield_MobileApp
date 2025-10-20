import React, { useState, useEffect } from "react";
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

const UpdateFEOScreen = ({ route, navigation }) => {
  const { feoId } = route.params;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    profileImageBase64: null, // NEW: Store Base64 string
  });

  useEffect(() => {
    loadFEO();
  }, []);

  const loadFEO = async () => {
    try {
      const response = await feoAPI.getFEOById(feoId);
      const feo = response.data;
      setFormData({
        fullName: feo.fullName,
        department: feo.department,
        designation: feo.designation,
        employeeId: feo.employeeId,
        assignedArea: feo.assignedArea,
        nicNo: feo.nicNo,
        email: feo.email,
        officeContact: feo.officeContact,
        profileImageBase64: feo.profileImage?.base64 || null,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load FEO details");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdate = async () => {
    if (
      !formData.fullName ||
      !formData.department ||
      !formData.designation ||
      !formData.employeeId ||
      !formData.assignedArea ||
      !formData.nicNo ||
      !formData.email ||
      !formData.officeContact
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setSubmitting(true);
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
      };

      // Add Base64 image if exists
      if (formData.profileImageBase64) {
        dataToSend.profileImageBase64 = formData.profileImageBase64;
      }

      await feoAPI.updateFEO(feoId, dataToSend);
      Alert.alert("Success", "FEO officer updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update FEO officer"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getImageUri = () => {
    if (formData.profileImageBase64) {
      return `data:image/jpeg;base64,${formData.profileImageBase64}`;
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          UPDATE FISHERIES ENFORCEMENT OFFICER
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.avatarSection}>
          {getImageUri() ? (
            <Image source={{ uri: getImageUri() }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="shield" size={40} color={COLORS.gray} />
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
              <Text style={styles.uploadButtonText}>Choose files</Text>
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

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdate}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.updateButtonText}>Update</Text>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});

export default UpdateFEOScreen;
