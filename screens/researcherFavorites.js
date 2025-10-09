// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import Layout from '../components/layout/layout';
// import { MaterialIcons } from '@expo/vector-icons'; 
// import ViewOneSpecies from '../screens/viewOneSpecies';
// import { useNavigation } from '@react-navigation/native'; 

// // Define the color palette
// const colors = {
//   background: '#F6F1F1',
//   primary: '#19A7CE',
//   secondary: '#146C94',
//   muted: '#AFD3E2',
//   accent: '#AFD3E2',
//   white: '#FFFFFF',
// };

// // Component for a single Favorite Item
// // It now accepts a 'onPress' prop for navigation and 'onDelete' for the icon action
// const FavoriteItem = ({ commonName, protectionStatus, onPress, onDelete }) => (
//   // The main TouchableOpacity makes the entire row clickable
//   <TouchableOpacity style={styles.favoriteItemContainer} onPress={onPress}> 

//     {/* Left Side: Photo and Details (Clickable Area) */}
//     <View style={styles.clickableContent}>
//         {/* Photo Placeholder */}
//         <View style={styles.photoPlaceholder}>
//           <Text style={styles.photoText}>Photo</Text>
//         </View>

//         {/* Text Details */}
//         <View style={styles.detailsContainer}>
//           <Text style={styles.commonName}>{commonName}</Text>
//           <Text style={styles.protectionStatus}>{protectionStatus}</Text>
//         </View>
//     </View>

//     {/* Right Side: Delete Icon (Separate Click Handler) */}
//     <TouchableOpacity style={styles.deleteIconContainer} onPress={onDelete}>
//       <MaterialIcons name="delete" size={24} color="gray" />
//     </TouchableOpacity>

//   </TouchableOpacity>
// );

// // The main screen component needs to receive the navigation prop
// const FavoritesScreen = () => {
//     const navigation = useNavigation(); 

//     // Placeholder function for navigation
//     const navigateToSpeciesPage = (speciesId, speciesName) => {
//         // ... (rest of the logic is the same)
//         navigation.navigate('ViewOneSpecies', { 
//             speciesId: speciesId, 
//             speciesName: speciesName 
//         });
//     };

//     // Placeholder function for deleting an item
//     const deleteFavorite = (speciesId) => {
//         console.log(`Deleting favorite with ID: ${speciesId}`);
//         // Add your state update logic here to remove the item from the list
//     };

//     const favoriteData = [
//         { id: 1, name: "Tiger", status: "Endangered" },
//         { id: 2, name: "Sea Otter", status: "Vulnerable" },
//         { id: 3, name: "Panda", status: "Vulnerable" },
//     ];

//     return (
//         <Layout>
//             <ScrollView style={styles.container}>
//                 <View style={styles.card}>
//                     <Text style={styles.favoritesTitle}>Favorites</Text>

//                     {/* List of Favorite Items */}
//                     {favoriteData.map((item) => (
//                         <FavoriteItem 
//                             key={item.id}
//                             commonName={item.name} 
//                             protectionStatus={item.status} 
//                             onPress={() => navigateToSpeciesPage(item.id, item.name)}
//                             // Pass the delete handler to the icon
//                             onDelete={() => deleteFavorite(item.id)}
//                         />
//                     ))}

//                 </View>
//             </ScrollView>
//         </Layout>
//     );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background, 
//     padding: 7,
//   },
//   card: {
//     backgroundColor: colors.white, 
//     borderRadius: 10,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   favoritesTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000', 
//     marginBottom: 20,
//   },
//   favoriteItemContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between', // Ensures space between content and delete icon
//     alignItems: 'center',
//     marginBottom: 15,
//     paddingVertical: 10,
//     borderBottomWidth: 1, 
//     borderBottomColor: '#f0f0f0', 
//   },
//   clickableContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1, // Allows content to take up the remaining space
//   },
//   photoPlaceholder: {
//     width: 60,
//     height: 60,
//     backgroundColor: '#e0e0e0', 
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//     borderWidth: 1,
//     borderColor: '#ccc', 
//   },
//   photoText: {
//     color: '#666', 
//     fontSize: 12,
//   },
//   detailsContainer: {
//     // No flex: 1 here, let it size based on content
//   },
//   commonName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   protectionStatus: {
//     fontSize: 14,
//     color: 'gray',
//     marginTop: 2,
//   },
//   deleteIconContainer: {
//     padding: 10, 
//     // Important: The delete icon needs padding to ensure its touch target is outside the main row touch target boundary,
//     // though the structure with two separate Touchables is the main solution.
//   },
// });

// export default FavoritesScreen;

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
