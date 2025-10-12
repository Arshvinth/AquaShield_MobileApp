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
import Icon from "react-native-vector-icons/Ionicons";
import { adminAPI } from "../../services/api";
import { COLORS } from "../../utils/constants";
import { useFocusEffect } from "@react-navigation/native";

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterUsers();
  }, [searchQuery]);

  const filterUsers = () => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleDelete = (user) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await adminAPI.deleteUser(user._id);
              Alert.alert("Success", "User deleted successfully");
              loadUsers();
            } catch (error) {
              Alert.alert("Error", "Failed to delete user");
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          {item.profileImage?.url ? (
            <Image
              source={{ uri: item.profileImage.url }}
              style={styles.userAvatar}
            />
          ) : (
            <View style={styles.userAvatarPlaceholder}>
              <Icon name="person" size={30} color={COLORS.white} />
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userContact}>{item.contactNo || "N/A"}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="ellipsis-vertical" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <View style={styles.userBody}>
        <View style={styles.userInfoRow}>
          <Text style={styles.userLabel}>Address:</Text>
          <Text style={styles.userValue}>{item.address || "N/A"}</Text>
        </View>
        <View style={styles.userInfoRow}>
          <Text style={styles.userLabel}>Joined:</Text>
          <Text style={styles.userValue}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.userInfoRow}>
          <Text style={styles.userLabel}>Status:</Text>
          <Text
            style={[
              styles.userValue,
              item.isActive ? styles.activeStatus : styles.inactiveStatus,
            ]}
          >
            {item.isActive ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      <View style={styles.userActions}>
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
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color={COLORS.gray}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.countContainer}>
        <Text style={styles.countText}>{filteredUsers.length}</Text>
        <Text style={styles.countLabel}>Total General Users</Text>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={64} color={COLORS.gray} />
            <Text style={styles.emptyText}>No users found</Text>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  countContainer: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,
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
  userCard: {
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
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 3,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 2,
  },
  userContact: {
    fontSize: 12,
    color: COLORS.gray,
  },
  menuButton: {
    padding: 5,
  },
  userBody: {
    paddingVertical: 10,
  },
  userInfoRow: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  userLabel: {
    fontSize: 14,
    color: COLORS.gray,
    width: 80,
  },
  userValue: {
    fontSize: 14,
    color: COLORS.dark,
    flex: 1,
    fontWeight: "500",
  },
  activeStatus: {
    color: COLORS.success,
  },
  inactiveStatus: {
    color: COLORS.danger,
  },
  userActions: {
    marginTop: 15,
  },
  deleteButton: {
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

export default UserListScreen;
