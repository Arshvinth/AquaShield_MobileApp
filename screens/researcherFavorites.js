import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import Layout from "../components/layout/layout";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigation } from "@react-navigation/native";

const colors = {
  background: "#F6F1F1",
  primary: "#19A7CE",
  secondary: "#146C94",
  white: "#FFFFFF",
};

// Single Favorite Item
const FavoriteItem = ({ item, onPress, onDelete }) => (
  <TouchableOpacity style={styles.favoriteItemContainer} onPress={onPress}>
    <View style={styles.clickableContent}>
      {/* Image */}
      {item.speciesId?.ImageURL ? (
        <Image
          source={{ uri: item.speciesId.ImageURL }}
          style={styles.photo}
        />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoText}>No Image</Text>
        </View>
      )}

      {/* Text */}
      <View>
        <Text style={styles.commonName}>
          {item.speciesId?.CommonName || "Unknown"}
        </Text>
        <Text style={styles.protectionStatus}>
          {item.speciesId?.ProtectionLevel || "N/A"}
        </Text>
      </View>
    </View>

    <TouchableOpacity style={styles.deleteIconContainer} onPress={onDelete}>
      <MaterialIcons name="delete" size={24} color="gray" />
    </TouchableOpacity>
  </TouchableOpacity>
);

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites from backend
  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     try {
  //       const res = await axios.get(`${API_BASE_URL}/api/favorites`, {
  //         params: { userId: "dummyUserId" }, // Replace with actual user
  //       });
  //       setFavorites(res.data);
  //     } catch (error) {
  //       console.error("Error fetching favorites:", error);
  //       Alert.alert("Error", "Failed to load favorites");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFavorites();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/favorites`, {
            params: { userId: "dummyUserId" },
          });
          setFavorites(res.data);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }, [])
  );

  const navigateToSpeciesPage = (speciesId, speciesName) => {
    navigation.navigate("ViewOneSpecies", {
      speciesId,
      speciesName,
    });
  };

  // Delete favorite item
  const deleteFavorite = async (speciesId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/favorites`, {
        data: { userId: "dummyUserId", speciesId },
      });
      setFavorites((prev) => prev.filter((f) => f.speciesId._id !== speciesId));
    } catch (error) {
      console.error("Error deleting favorite:", error);
      Alert.alert("Error", "Failed to delete favorite");
    }
  };

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.favoritesTitle}>Favorites</Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : favorites.length === 0 ? (
            <Text style={{ color: "gray", textAlign: "center" }}>
              No favorites found.
            </Text>
          ) : (
            favorites.map((item) => (
              <FavoriteItem
                key={item._id}
                item={item}
                onPress={() =>
                  navigateToSpeciesPage(
                    item.speciesId._id,
                    item.speciesId.CommonName
                  )
                }
                onDelete={() => deleteFavorite(item.speciesId._id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 7,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 20,
  },
  favoriteItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  clickableContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  photoText: {
    color: "#666",
    fontSize: 12,
  },
  commonName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  protectionStatus: {
    fontSize: 14,
    color: "gray",
  },
  deleteIconContainer: {
    padding: 10,
  },
});

export default FavoritesScreen;
