import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import Footer from "../components/layout/footer";
import axios from "axios";
import { API_BASE_URL } from "../config";

const { width: screenWidth } = Dimensions.get("window");

const ViewOneSpecies = ({ route }) => {
  const { speciesId } = route.params;
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/species/getOneSpecies/${speciesId}`);
        setSpecies(res.data);
      } catch (error) {
        console.error("Error fetching species:", error);
        Alert.alert("Error", "Failed to load species details.");
      } finally {
        setLoading(false);
      }
    };
    fetchSpecies();
  }, [speciesId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#146C94" />
        <Text style={{ color: "#146C94", marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  if (!species) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: "#FF0000" }}>Species not found</Text>
      </View>
    );
  }


  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      {/* Image Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageSlider}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      >
        {/* Image */}
        {species.ImageURL ? (
          <Image
            source={{ uri: species.ImageURL }}
            style={[styles.image, { width: screenWidth - 30, height: 200 }]}
          />
        ) : (
          <Text style={{ textAlign: 'center', color: '#888' }}>No image available</Text>
        )}
      </ScrollView>

      {/* Species Details */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{species.ScientificName}</Text>
          <TouchableOpacity>
            <MaterialIcons name="favorite-border" size={24} color="#19A7CE" />
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Common Name:</Text>
          <Text style={styles.value}>{species.CommonName || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{species.SpeciesCategory || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Protection Level:</Text>
          <Text style={styles.value}>{species.ProtectionLevel || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Protection Status:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {species.ProtectionStatus ? (
              <>
                <MaterialIcons name="check-circle" size={16} color="#28a745" style={{ marginRight: 5 }} />
                <Text style={[styles.value, { color: '#28a745' }]}>Protected</Text>
              </>
            ) : (
              <Text style={[styles.value, { color: '#dc3545' }]}>Not Protected</Text>
            )}
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Habitat:</Text>
          <Text style={styles.value}>{species.Habitat || "N/A"}</Text>
        </View>

        <Text style={[styles.label, { marginTop: 10 }]}>Description</Text>
        <Text style={styles.description}>
          {species.Description || "No description available."}
        </Text>
      </View>

      {/* Suggestions Section */}
      <View style={styles.suggestionsCard}>
        <Text style={styles.suggestionsTitle}>Similar Species</Text>
        <TouchableOpacity style={styles.suggestionRow}>
          <Text style={styles.suggestionText}>Whale Shark</Text>
          <View style={styles.suggestionIcons}>
            <MaterialIcons name="favorite-border" size={20} color="#19A7CE" />
            <Entypo name="chevron-right" size={20} color="#146C94" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.suggestionRow}>
          <Text style={styles.suggestionText}>Swordfish</Text>
          <View style={styles.suggestionIcons}>
            <MaterialIcons name="favorite-border" size={20} color="#19A7CE" />
            <Entypo name="chevron-right" size={20} color="#146C94" />
          </View>
        </TouchableOpacity>
      </View>

      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F1F1",
    padding: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F1F1",
  },
  imageSlider: {
    marginBottom: 20,
  },
  image: {
    height: 180,
    borderRadius: 12,
    marginRight: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#146C94",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: "#146C94",
    width: 130,
    fontSize: 14,
  },
  value: {
    color: "#19A7CE",
    fontWeight: "500",
    flexShrink: 1,
    fontSize: 14,
  },
  description: {
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  suggestionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 60,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#146C94",
    marginBottom: 10,
  },
  suggestionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E3E3E3",
    alignItems: "center",
  },
  suggestionText: {
    fontSize: 14,
    color: "#19A7CE",
    fontWeight: "500",
  },
  suggestionIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default ViewOneSpecies;
