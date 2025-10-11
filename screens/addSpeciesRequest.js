
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_BASE_URL } from "../config";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Layout from "../components/layout/layout";
import Footer from "../components/layout/footer";

const AddSpeciesRequest = ({ navigation }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    requesterName: "",
    scientificName: "",
    commonName: "",
    category: "",
    protectionLevel: "",
    habitat: "",
    description: "",
    isProtected: false,
    foundDate: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // Image Picker
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const pickedUri = result.assets[0].uri;
        setImage({ uri: pickedUri });
      }
    } catch (err) {
      console.error("Error picking image:", err);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // hide picker after selection
    if (selectedDate) {
      const today = new Date();
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(today.getMonth() - 2);

      if (selectedDate > today) {
        Alert.alert("Invalid Date", "Found Date cannot be in the future.");
        return;
      }
      if (selectedDate < twoMonthsAgo) {
        Alert.alert("Invalid Date", "Found Date cannot be older than 2 months.");
        return;
      }

      const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      handleChange("foundDate", formattedDate);
    }
  };

  // Submit Handler
  const handleSubmit = async () => {
    // Validate required fields
    if (
      !form.requesterName ||
      !form.scientificName ||
      !form.commonName ||
      !form.category ||
      !form.protectionLevel ||
      !form.habitat
    ) {
      Alert.alert("Missing Fields", "Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("requesterName", form.requesterName);
    formData.append("scientificName", form.scientificName);
    formData.append("commonName", form.commonName);
    formData.append("speciesCategory", form.category);
    formData.append("protectionLevel", form.protectionLevel);
    formData.append("habitat", form.habitat);
    formData.append("description", form.description);
    formData.append("protectionStatus", form.isProtected);
    formData.append("updatedDate", form.foundDate);

    if (image) {
      formData.append("image", {
        uri: image.uri,
        type: "image/jpeg",
        name: "species.jpg",
      });
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/speciesRequest/addSpeciesRequest`, 
        formData,
        { headers: { Accept: "application/json", "Content-Type": "multipart/form-data" } }

      );

      Alert.alert("Success", "Species Request Submitted!");
      navigation.goBack();
    } catch (err) {
      console.error("Error submitting request:", err);
      Alert.alert("Error", "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Requester Name */}
        <Text style={styles.label}>Requester Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={form.requesterName}
          onChangeText={(v) => handleChange("requesterName", v)}
        />

        {/* Scientific Name */}
        <Text style={styles.label}>Scientific Name *</Text>
        <TextInput
          style={styles.input}
          value={form.scientificName}
          onChangeText={(v) => handleChange("scientificName", v)}
        />

        {/* Common Name */}
        <Text style={styles.label}>Common Name *</Text>
        <TextInput
          style={styles.input}
          value={form.commonName}
          onChangeText={(v) => handleChange("commonName", v)}
        />

        {/* Category */}
        <Text style={styles.label}>Category *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.category}
            onValueChange={(v) => handleChange("category", v)}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Freshwater" value="Freshwater" />
            <Picker.Item label="Saltwater-Marine" value="Saltwater-Marine" />
            <Picker.Item label="Brackish Mix" value="Brackish Mix" />
            <Picker.Item label="Reef-associated" value="Reef-associated" />
            <Picker.Item label="Migratory" value="Migratory" />
          </Picker>
        </View>

        {/* Protection Level */}
        <Text style={styles.label}>Protection Level *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.protectionLevel}
            onValueChange={(v) => handleChange("protectionLevel", v)}
          >
            <Picker.Item label="Select Level" value="" />
            <Picker.Item label="Least Concern" value="Least Concern" />
            <Picker.Item label="Vulnerable" value="Vulnerable" />
            <Picker.Item label="Endangered" value="Endangered" />
            <Picker.Item label="Critically Endangered" value="Critically Endangered" />
          </Picker>
        </View>

        {/* Habitat */}
        <Text style={styles.label}>Habitat *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.habitat}
            onValueChange={(v) => handleChange("habitat", v)}
          >
            <Picker.Item label="Select Habitat" value="" />
            <Picker.Item label="Rivers" value="Rivers" />
            <Picker.Item label="Ocean" value="Ocean" />
            <Picker.Item label="Lakes" value="Lakes" />
            <Picker.Item label="Coral Reefs" value="Coral Reefs" />
            <Picker.Item label="Mangroves" value="Mangroves" />
          </Picker>
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={form.description}
          onChangeText={(v) => handleChange("description", v)}
        />

        {/* Protection Status */}
        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
          <Text style={{ color: "#146C94", fontWeight: "600", flex: 1 }}>Protection Status</Text>
          <Switch
            value={form.isProtected}
            onValueChange={(v) => handleChange("isProtected", v)}
            trackColor={{ false: "#ccc", true: "#19A7CE" }}
            thumbColor={form.isProtected ? "#146C94" : "#fff"}
          />
        </View>

        {/* Found Date */}
        <Text style={styles.label}>Found Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: form.foundDate ? "#146C94" : "#999" }}>
            {form.foundDate || "Select Found Date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={form.foundDate ? new Date(form.foundDate) : new Date()}
            mode="date"
            display="calendar"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
        {/* Image Upload */}
        <Text style={styles.label}>Upload Image</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>
            {image ? "Image Selected ✅" : "Choose Image"}
          </Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: "100%", height: 200, borderRadius: 10, marginBottom: 10 }}
          />
        )}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>

        <Footer />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#F6F1F1" },
  label: { fontSize: 14, fontWeight: "600", color: "#146C94", marginTop: 10 },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#AFD3E2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#146C94",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  pickerContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#AFD3E2",
    borderRadius: 10,
    marginVertical: 5,
  },
  uploadButton: {
    backgroundColor: "#AFD3E2",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
  },
  uploadButtonText: { fontWeight: "600", color: "#146C94" },
  actionRow: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 50,
  },
  cancelButton: { backgroundColor: "#146C94" },
  submitButton: { backgroundColor: "#19A7CE" },
  buttonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
});

export default AddSpeciesRequest;










