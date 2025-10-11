import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import { COLORS } from "../../utils/constants";

const UserProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      setLoading(true); // Set loading to true when refetching
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout, style: "destructive" },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await userAPI.deleteAccount();
              logout();
            } catch (error) {
              Alert.alert("Error", "Failed to delete account");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY PROFILE</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Icon name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {profile?.profileImage?.url ? (
            <Image
              source={{ uri: profile.profileImage.url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={60} color={COLORS.white} />
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>First Name</Text>
            <Text style={styles.infoValue}>{profile?.firstName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Name</Text>
            <Text style={styles.infoValue}>{profile?.lastName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile?.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact No</Text>
            <Text style={styles.infoValue}>{profile?.contactNo || "N/A"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{profile?.address || "N/A"}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("UpdateProfile")}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.passwordSection}>
        <Text style={styles.sectionTitle}>CHANGE PASSWORD</Text>
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text style={styles.changePasswordButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dangerSection}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Request Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
  profileSection: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  passwordSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.danger,
    marginBottom: 15,
  },
  changePasswordButton: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  changePasswordButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  dangerSection: {
    padding: 20,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserProfileScreen;
