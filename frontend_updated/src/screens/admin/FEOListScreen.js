import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Ionicons";
import { feoAPI } from "../../services/api";
import { COLORS, DEPARTMENTS } from "../../utils/constants";
import { useFocusEffect } from "@react-navigation/native";

const FEOListScreen = ({ navigation }) => {
  const [feos, setFeos] = useState([]);
  const [filteredFeos, setFilteredFeos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  useFocusEffect(
    useCallback(() => {
      loadFEOs();
    }, [])
  );

  const loadFEOs = async () => {
    try {
      const response = await feoAPI.getAllFEOs();
      setFeos(response.data.feos);
      setFilteredFeos(response.data.feos);
    } catch (error) {
      console.error("Error loading FEOs:", error);
      Alert.alert("Error", "Failed to load FEO officers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterFEOs();
  }, [searchQuery, selectedDepartment]);

  const filterFEOs = () => {
    let filtered = feos;

    if (selectedDepartment !== "All") {
      filtered = filtered.filter(
        (feo) => feo.department === selectedDepartment
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (feo) =>
          feo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          feo.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          feo.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFeos(filtered);
  };

  const handleDelete = (feo) => {
    Alert.alert(
      "Delete FEO Officer",
      `Are you sure you want to delete ${feo.fullName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await feoAPI.deleteFEO(feo._id);
              Alert.alert("Success", "FEO officer deleted successfully");
              loadFEOs();
            } catch (error) {
              Alert.alert("Error", "Failed to delete FEO officer");
            }
          },
        },
      ]
    );
  };

  const renderFEOItem = ({ item }) => (
    <View style={styles.feoCard}>
      <View style={styles.feoHeader}>
        <View style={styles.feoInfo}>
          {item.profileImage?.url ? (
            <Image
              source={{ uri: item.profileImage.url }}
              style={styles.feoAvatar}
            />
          ) : (
            <View style={styles.feoAvatarPlaceholder}>
              <Icon name="shield" size={30} color={COLORS.white} />
            </View>
          )}
          <View style={styles.feoDetails}>
            <Text style={styles.feoName}>{item.fullName}</Text>
            <Text style={styles.feoDepartment}>{item.department}</Text>
            <Text style={styles.feoDesignation}>{item.designation}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="ellipsis-vertical" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <View style={styles.feoBody}>
        <View style={styles.feoInfoRow}>
          <Text style={styles.feoLabel}>Employee ID:</Text>
          <Text style={styles.feoValue}>{item.employeeId}</Text>
        </View>
        <View style={styles.feoInfoRow}>
          <Text style={styles.feoLabel}>Area:</Text>
          <Text style={styles.feoValue}>{item.assignedArea}</Text>
        </View>
        <View style={styles.feoInfoRow}>
          <Text style={styles.feoLabel}>Email:</Text>
          <Text style={styles.feoValue}>{item.email}</Text>
        </View>
        <View style={styles.feoInfoRow}>
          <Text style={styles.feoLabel}>NIC:</Text>
          <Text style={styles.feoValue}>{item.nicNo}</Text>
        </View>
        <View style={styles.feoInfoRow}>
          <Text style={styles.feoLabel}>Contact:</Text>
          <Text style={styles.feoValue}>{item.officeContact}</Text>
        </View>
      </View>

      <View style={styles.feoActions}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => navigation.navigate("UpdateFEO", { feoId: item._id })}
        >
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color={COLORS.gray}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Here"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDepartment}
            onValueChange={setSelectedDepartment}
            style={styles.picker}
          >
            <Picker.Item label="All" value="All" />
            {DEPARTMENTS.map((dept) => (
              <Picker.Item key={dept} label={dept} value={dept} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.countContainer}>
        <Text style={styles.countText}>{filteredFeos.length}</Text>
        <Text style={styles.countLabel}>Total FEOs</Text>
      </View>

      <FlatList
        data={filteredFeos}
        renderItem={renderFEOItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={64} color={COLORS.gray} />
            <Text style={styles.emptyText}>No FEO officers found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    padding: 15,
    backgroundColor: COLORS.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.light,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  picker: {
    height: 50,
  },
  countContainer: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
  },
  countText: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.white,
  },
  countLabel: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
  },
  feoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  feoInfo: {
    flexDirection: "row",
    flex: 1,
  },
  feoAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  feoAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  feoDetails: {
    flex: 1,
    justifyContent: "center",
  },
  feoName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 2,
  },
  feoDepartment: {
    fontSize: 13,
    color: COLORS.primary,
    marginBottom: 2,
  },
  feoDesignation: {
    fontSize: 12,
    color: COLORS.gray,
  },
  menuButton: {
    padding: 5,
  },
  feoBody: {
    paddingVertical: 10,
  },
  feoInfoRow: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  feoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    width: 100,
  },
  feoValue: {
    fontSize: 14,
    color: COLORS.dark,
    flex: 1,
    fontWeight: "500",
  },
  feoActions: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },
  updateButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.danger,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 10,
  },
});

export default FEOListScreen;
