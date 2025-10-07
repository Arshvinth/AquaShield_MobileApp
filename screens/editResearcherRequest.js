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
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import Layout from "../components/layout/layout";
import Footer from "../components/layout/footer";
import { API_BASE_URL } from "../config";

const ViewSpeciesRequest = ({ navigation, route }) => {
  const { speciesId } = route.params;

  const [form, setForm] = useState({
    ScientificName: "",
    CommonName: "",
    SpeciesCategory: "",
    ProtectionLevel: "",
    Habitat: "",
    Description: "",
    ImageURL: "",
    updatedDate: new Date(),
    ProtectionStatus: false,
  });

  const [originalForm, setOriginalForm] = useState({});
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        setImage({ uri: result.assets[0].uri });
      }
    } catch (err) {
      console.error("Error picking image:", err);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  // Fetch species by ID
  const fetchSpeciesRequest = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/speciesRequest/getOneSpeciesRequests/${speciesId}`
      );
      const data = res.data;

      const mappedData = {
        ScientificName: data.ScientificName || "",
        CommonName: data.CommonName || "",
        SpeciesCategory: data.SpeciesCategory || "",
        ProtectionLevel: data.ProtectionLevel || "",
        Habitat: data.Habitat || "",
        Description: data.Description || "",
        ImageURL: data.ImageURL || "",
        updatedDate: data.updatedDate ? new Date(data.updatedDate) : new Date(),
        ProtectionStatus: data.ProtectionStatus || false,
      };

      setForm(mappedData);
      setOriginalForm(mappedData);

      if (data.ImageURL) setImage({ uri: data.ImageURL });
    } catch (err) {
      console.error("Error fetching species:", err);
      Alert.alert("Error", "Failed to load species data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeciesRequest();
  }, []);

  const handleEditOrUpdate = async () => {
    if (!isEditMode) {
      // Enable edit mode
      setIsEditMode(true);
      return;
    }

    // Check changes
    const hasChanges =
      Object.keys(form).some((key) => {
        if (key === "updatedDate") {
          return form[key].toISOString() !== originalForm[key].toISOString();
        }
        return form[key] !== originalForm[key];
      }) || (image?.uri !== originalForm.ImageURL && image?.uri);

    if (!hasChanges) {
      Alert.alert("No Changes", "You haven’t made any updates.");
      setIsEditMode(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "updatedDate") {
          if (form[key].toISOString() !== originalForm[key].toISOString()) {
            formData.append(key, form[key].toISOString());
          }
        } else if (form[key] !== originalForm[key]) {
          formData.append(key, form[key]);
        }
      });

      if (image?.uri && !image.uri.startsWith("http")) {
        formData.append("image", {
          uri: image.uri,
          name: "species.jpg",
          type: "image/jpeg",
        });
      }

      await axios.put(
        `${API_BASE_URL}/speciesRequest/updateSpeciesRequest/${speciesId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Alert.alert("Success", "Species updated successfully!");
      setOriginalForm(form);
      setIsEditMode(false);
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Failed to update species request.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#146C94" />
        </View>
      </Layout>
    );
  }

  // Date limits
  const now = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(now.getMonth() - 2);

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Image */}
        <View style={styles.imageContainer}>
          {image ? (
            <Image
              source={{ uri: image.uri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageBox}>
              <Text style={styles.noImageText}>No Image Available</Text>
            </View>
          )}
          {isEditMode && (
            <TouchableOpacity style={styles.newImageButton} onPress={pickImage}>
              <Text style={styles.newImageText}>📷 New Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Fields */}
        <Text style={styles.label}>Scientific Name</Text>
        <TextInput
          style={[styles.input, !isEditMode && styles.disabled]}
          value={form.ScientificName}
          editable={isEditMode}
          onChangeText={(v) => handleChange("ScientificName", v)}
        />

        <Text style={styles.label}>Common Name</Text>
        <TextInput
          style={[styles.input, !isEditMode && styles.disabled]}
          value={form.CommonName}
          editable={isEditMode}
          onChangeText={(v) => handleChange("CommonName", v)}
        />

        <Text style={styles.label}>Category</Text>
        <View style={[styles.pickerContainer, !isEditMode && styles.disabledPicker]}>
          <Picker
            selectedValue={form.SpeciesCategory}
            enabled={isEditMode}
            onValueChange={(v) => handleChange("SpeciesCategory", v)}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Freshwater" value="Freshwater" />
            <Picker.Item label="Saltwater-Marine" value="Saltwater-Marine" />
            <Picker.Item label="Brackish Mix" value="Brackish Mix" />
          </Picker>
        </View>

        <Text style={styles.label}>Protection Level</Text>
        <View style={[styles.pickerContainer, !isEditMode && styles.disabledPicker]}>
          <Picker
            selectedValue={form.ProtectionLevel}
            enabled={isEditMode}
            onValueChange={(v) => handleChange("ProtectionLevel", v)}
          >
            <Picker.Item label="Select Level" value="" />
            <Picker.Item label="Endangered" value="Endangered" />
            <Picker.Item label="Vulnerable" value="Vulnerable" />
            <Picker.Item label="Least Concern" value="Least Concern" />
          </Picker>
        </View>

        <Text style={styles.label}>Habitat</Text>
        <View style={[styles.pickerContainer, !isEditMode && styles.disabledPicker]}>
          <Picker
            selectedValue={form.Habitat}
            enabled={isEditMode}
            onValueChange={(v) => handleChange("Habitat", v)}
          >
            <Picker.Item label="Select Habitat" value="" />
            <Picker.Item label="Rivers" value="Rivers" />
            <Picker.Item label="Ocean" value="Ocean" />
            <Picker.Item label="Lakes" value="Lakes" />
          </Picker>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, !isEditMode && styles.disabled]}
          multiline
          editable={isEditMode}
          value={form.Description}
          onChangeText={(v) => handleChange("Description", v)}
        />

        {/* Updated Date */}
        <Text style={styles.label}>Updated Date</Text>
        <TouchableOpacity
          style={[styles.input, !isEditMode && styles.disabled]}
          onPress={() => isEditMode && setShowDatePicker(true)}
        >
          <Text>{form.updatedDate.toISOString().substring(0, 10)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={form.updatedDate || new Date()}
            mode="date"
            display="default"
            maximumDate={now}
            minimumDate={twoMonthsAgo}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) handleChange("updatedDate", date);
            }}
          />
        )}

        {/* Protection Status */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#146C94" }}>
            Protection Status
          </Text>
          <Switch
            value={form.ProtectionStatus}
            onValueChange={(val) => handleChange("ProtectionStatus", val)}
            disabled={!isEditMode}
            style={{ marginLeft: 10 }}
          />
        </View>

        {/* Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleEditOrUpdate}
          >
            <Text style={styles.buttonText}>{isEditMode ? "Update" : "Edit"}</Text>
          </TouchableOpacity>
        </View>

        <Footer />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#F6F1F1",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  imagePreview: {
    width: 220,
    height: 220,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#AFD3E2",
  },
  noImageBox: {
    width: 220,
    height: 220,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#AFD3E2",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F6F9",
  },
  noImageText: {
    color: "#146C94",
    fontWeight: "600",
  },
  newImageButton: {
    marginTop: 10,
    backgroundColor: "#19A7CE",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  newImageText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#146C94",
    marginTop: 10,
  },
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
  disabled: {
    backgroundColor: "#E3E3E3",
    color: "#888",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#AFD3E2",
    borderRadius: 10,
    height:45
  },
  disabledPicker: {
    backgroundColor: "#E3E3E3",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 50,
    marginTop:50
  },
  cancelButton: {
    backgroundColor: "#146C94",
  },
  submitButton: {
    backgroundColor: "#19A7CE",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});


export default ViewSpeciesRequest;

