import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Layout from '../components/layout/layout';
import { MaterialIcons } from '@expo/vector-icons'; 
import ViewOneSpecies from '../screens/viewOneSpecies';
import { useNavigation } from '@react-navigation/native'; 

// Define the color palette
const colors = {
  background: '#F6F1F1',
  primary: '#19A7CE',
  secondary: '#146C94',
  muted: '#AFD3E2',
  accent: '#AFD3E2',
  white: '#FFFFFF',
};

// Component for a single Favorite Item
// It now accepts a 'onPress' prop for navigation and 'onDelete' for the icon action
const FavoriteItem = ({ commonName, protectionStatus, onPress, onDelete }) => (
  // The main TouchableOpacity makes the entire row clickable
  <TouchableOpacity style={styles.favoriteItemContainer} onPress={onPress}> 
    
    {/* Left Side: Photo and Details (Clickable Area) */}
    <View style={styles.clickableContent}>
        {/* Photo Placeholder */}
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoText}>Photo</Text>
        </View>

        {/* Text Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.commonName}>{commonName}</Text>
          <Text style={styles.protectionStatus}>{protectionStatus}</Text>
        </View>
    </View>

    {/* Right Side: Delete Icon (Separate Click Handler) */}
    <TouchableOpacity style={styles.deleteIconContainer} onPress={onDelete}>
      <MaterialIcons name="delete" size={24} color="gray" />
    </TouchableOpacity>
    
  </TouchableOpacity>
);

// The main screen component needs to receive the navigation prop
const FavoritesScreen = () => {
    const navigation = useNavigation(); 

    // Placeholder function for navigation
    const navigateToSpeciesPage = (speciesId, speciesName) => {
        // ... (rest of the logic is the same)
        navigation.navigate('ViewOneSpecies', { 
            speciesId: speciesId, 
            speciesName: speciesName 
        });
    };

    // Placeholder function for deleting an item
    const deleteFavorite = (speciesId) => {
        console.log(`Deleting favorite with ID: ${speciesId}`);
        // Add your state update logic here to remove the item from the list
    };

    const favoriteData = [
        { id: 1, name: "Tiger", status: "Endangered" },
        { id: 2, name: "Sea Otter", status: "Vulnerable" },
        { id: 3, name: "Panda", status: "Vulnerable" },
    ];

    return (
        <Layout>
            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.favoritesTitle}>Favorites</Text>
                    
                    {/* List of Favorite Items */}
                    {favoriteData.map((item) => (
                        <FavoriteItem 
                            key={item.id}
                            commonName={item.name} 
                            protectionStatus={item.status} 
                            onPress={() => navigateToSpeciesPage(item.id, item.name)}
                            // Pass the delete handler to the icon
                            onDelete={() => deleteFavorite(item.id)}
                        />
                    ))}

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', 
    marginBottom: 20,
  },
  favoriteItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures space between content and delete icon
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0', 
  },
  clickableContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allows content to take up the remaining space
  },
  photoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0', 
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ccc', 
  },
  photoText: {
    color: '#666', 
    fontSize: 12,
  },
  detailsContainer: {
    // No flex: 1 here, let it size based on content
  },
  commonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  protectionStatus: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  deleteIconContainer: {
    padding: 10, 
    // Important: The delete icon needs padding to ensure its touch target is outside the main row touch target boundary,
    // though the structure with two separate Touchables is the main solution.
  },
});

export default FavoritesScreen;