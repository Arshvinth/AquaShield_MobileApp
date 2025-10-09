import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Layout from "../components/layout/layout";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL } from "../config";

const ResearcherSpeciesRequests = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch species requests
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/speciesRequest/getAllSpeciesRequests`);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching species requests:", error);
      Alert.alert("Error", "Failed to fetch species requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (speciesId, speciesName) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${speciesName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `${API_BASE_URL}/speciesRequest/deleteSpeciesRequest/${speciesId}`
              );
              Alert.alert("Deleted", `${speciesName} has been deleted.`);
              fetchData();
            } catch (err) {
              console.error("Delete failed:", err);
              Alert.alert("Error", "Failed to delete species request.");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#19A7CE" />
          <Text style={{ color: "#146C94", marginTop: 10 }}>Loading...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Page Title */}
        <Text style={styles.pageTitle}>My Species Requests</Text>

        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerText, styles.dateSpeciesCol]}>
            Date / Species
          </Text>
          <Text style={[styles.cell, styles.headerText, styles.statusCol]}>
            Status
          </Text>
          <Text style={[styles.cell, styles.headerText, styles.actionCol]}>
            Action
          </Text>
        </View>

        {/* Table Rows */}
        {data.length > 0 ? (
          data.map((item) => (
            <View key={item._id} style={styles.row}>
              {/* Date & Species stacked */}
              <View style={styles.dateSpeciesCol}>
                <Text style={styles.dateText}>{item.updatedDate?.split("T")[0]}</Text>
                <Text style={styles.speciesName}>
                  {item.ScientificName || item.CommonName}
                </Text>
              </View>

              {/* Status */}
              <View style={styles.statusCol}>
                <Text
                  style={[
                    styles.statusBadge,
                    item.RequestStatus === "Approved"
                      ? styles.statusApproved
                      : item.RequestStatus === "Rejected"
                      ? styles.statusRejected
                      : styles.statusPending,
                  ]}
                >
                  {item.RequestStatus || "Pending"}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.actionCol}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditRequest", { speciesId: item._id })
                  }
                  style={styles.iconBtn}
                >
                  <MaterialIcons name="edit" size={22} color="#19A7CE" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleDelete(item._id, item.ScientificName || item.CommonName)
                  }
                  style={styles.iconBtn}
                >
                  <MaterialIcons name="delete" size={22} color="#FF4D4D" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No species requests found.</Text>
        )}

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddSpeciesRequest")}
        >
          <Text style={styles.addButtonText}>+ Add New Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    backgroundColor: "#F6F1F1",
    paddingBottom: 80,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F1F1",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#146C94",
    textAlign: "center",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    backgroundColor: "#AFD3E2",
    borderRadius: 12,
    marginBottom: 8,
    paddingVertical: 10,
  },
  headerText: {
    fontWeight: "700",
    color: "#146C94",
  },
  cell: {
    fontSize: 14,
    color: "#146C94",
    paddingHorizontal: 4,
  },
  dateSpeciesCol: {
    width: "45%",
  },
  statusCol: {
    width: "30%",
    alignItems: "center",
  },
  actionCol: {
    width: "25%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  dateText: {
    color: "#146C94",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  speciesName: {
    color: "#19A7CE",
    fontWeight: "600",
    fontSize: 14,
  },
  statusBadge: {
    fontWeight: "600",
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 12,
    overflow: "hidden",
  },
  statusApproved: { backgroundColor: "#4CAF50" },
  statusRejected: { backgroundColor: "#FF5252" },
  statusPending: { backgroundColor: "#FFB300" },
  iconBtn: { marginRight: 10 },
  addButton: {
    marginTop: 25,
    backgroundColor: "#19A7CE",
    paddingVertical: 12,
    borderRadius: 14,
    height:'15%',
    width:'60%',
    alignItems: "center",
    shadowColor: "#19A7CE",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  noDataText: {
    textAlign: "center",
    color: "#146C94",
    fontSize: 14,
    marginTop: 20,
  },
});

export default ResearcherSpeciesRequests;

