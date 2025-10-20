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
  TextInput,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import { COLORS } from "../../utils/constants";

const UserProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [submittingDeletion, setSubmittingDeletion] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      setProfile(response.data);
      console.log(
        "✅ Profile loaded - Full profile data:",
        JSON.stringify(response.data, null, 2)
      );
      console.log(
        "✅ Deletion Status:",
        response.data.deletionRequestStatus,
        "Type:",
        typeof response.data.deletionRequestStatus
      );
      console.log("✅ Deletion Requested:", response.data.deletionRequested);
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

  const handleRequestDeletion = () => {
    if (profile?.deletionRequestStatus === "rejected") {
      // If rejected, show rejection message and allow new request
      Alert.alert(
        "Account Deletion Rejected",
        "Your account deletion request was rejected. Contact us for more details.\n\nWould you like to submit a new request?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Submit New Request",
            onPress: () => setShowDeletionModal(true),
          },
        ]
      );
    } else if (profile?.deletionRequestStatus === "pending") {
      // Show cancel option if pending
      Alert.alert(
        "Cancel Deletion Request",
        "Do you want to cancel your account deletion request?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes, Cancel Request",
            onPress: cancelDeletionRequest,
          },
        ]
      );
    } else {
      // Show modal to request deletion
      setShowDeletionModal(true);
    }
  };

  const submitDeletionRequest = async () => {
    if (!deletionReason.trim()) {
      Alert.alert("Error", "Please provide a reason for account deletion");
      return;
    }

    setSubmittingDeletion(true);
    try {
      await userAPI.requestDeletion(deletionReason);
      setShowDeletionModal(false);
      setDeletionReason("");

      Alert.alert(
        "Request Submitted",
        "Your account deletion request has been submitted. An administrator will review it soon.",
        [{ text: "OK", onPress: loadProfile }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to submit deletion request"
      );
    } finally {
      setSubmittingDeletion(false);
    }
  };

  const cancelDeletionRequest = async () => {
    try {
      await userAPI.cancelDeletionRequest();
      Alert.alert(
        "Request Cancelled",
        "Your account deletion request has been cancelled.",
        [{ text: "OK", onPress: loadProfile }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to cancel deletion request"
      );
    }
  };

  const getImageUri = () => {
    if (profile?.profileImage?.base64) {
      return `data:image/jpeg;base64,${profile.profileImage.base64}`;
    }
    if (profile?.profileImage?.url) {
      return profile.profileImage.url;
    }
    return null;
  };

  // Helper function to get deletion status info
  // Helper function to get deletion status info
  const getDeletionStatusInfo = () => {
    if (!profile) return null;

    console.log("🔍 Debug - Profile deletion data:", {
      deletionRequested: profile.deletionRequested,
      deletionRequestStatus: profile.deletionRequestStatus,
      deletionReason: profile.deletionReason,
      deletionRequestedAt: profile.deletionRequestedAt,
    });

    // ✅ ONLY show deletion status if user has actually requested deletion
    if (!profile.deletionRequested || profile.deletionRequested === false) {
      return {
        type: "normal",
        buttonText: "Request Account Deletion",
        buttonStyle: styles.deleteButton,
      };
    }

    // ✅ User has requested deletion, now check the status
    switch (profile.deletionRequestStatus) {
      case "pending":
        return {
          type: "warning",
          icon: "alert-circle",
          title: "Deletion Pending",
          message:
            "Your account deletion request is being reviewed by an administrator.",
          buttonText: "Cancel Deletion Request",
          buttonStyle: styles.cancelButton,
        };
      case "rejected":
        return {
          type: "rejected",
          icon: "close-circle",
          title: "Account Deletion Rejected",
          message: "Account deletion rejected. Contact us for more details.",
          buttonText: "Request Deletion Again",
          buttonStyle: styles.deleteButton,
        };
      default:
        // If deletion was requested but status is unknown, treat as pending
        return {
          type: "warning",
          icon: "alert-circle",
          title: "Deletion Pending",
          message:
            "Your account deletion request is being reviewed by an administrator.",
          buttonText: "Cancel Deletion Request",
          buttonStyle: styles.cancelButton,
        };
    }
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const deletionStatus = getDeletionStatusInfo();

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

      {/* Deletion Status Banner - Only show if user has actually requested deletion */}
      {profile?.deletionRequested &&
        deletionStatus &&
        deletionStatus.type === "rejected" && (
          <View style={styles.rejectedBanner}>
            <Icon name="close-circle" size={24} color={COLORS.danger} />
            <View style={styles.statusContent}>
              <Text style={styles.rejectedTitle}>
                Account Deletion Rejected
              </Text>
              <Text style={styles.rejectedText}>
                Contact us for more details.
              </Text>
            </View>
          </View>
        )}

      {/* Show pending banner only if user has actually requested deletion */}
      {profile?.deletionRequested &&
        deletionStatus &&
        deletionStatus.type === "warning" && (
          <View style={styles.warningBanner}>
            <Icon name="alert-circle" size={24} color={COLORS.warning} />
            <View style={styles.statusContent}>
              <Text style={styles.warningTitle}>Deletion Pending</Text>
              <Text style={styles.warningText}>
                Your account deletion request is being reviewed by an
                administrator.
              </Text>
            </View>
          </View>
        )}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {getImageUri() ? (
            <Image
              source={{ uri: getImageUri() }}
              style={styles.avatar}
              onError={(e) => {
                console.error("Image load error:", e.nativeEvent.error);
              }}
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
        <Text style={styles.dangerTitle}>DANGER ZONE</Text>
        <TouchableOpacity
          style={deletionStatus?.buttonStyle || styles.deleteButton}
          onPress={handleRequestDeletion}
        >
          <Icon
            name={
              deletionStatus?.type === "warning"
                ? "close-circle"
                : deletionStatus?.type === "rejected"
                ? "refresh-circle"
                : "trash"
            }
            size={20}
            color={COLORS.white}
          />
          <Text style={styles.deleteButtonText}>
            {deletionStatus?.buttonText || "Request Account Deletion"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Deletion Request Modal */}
      <Modal
        visible={showDeletionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeletionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Icon name="alert-circle" size={48} color={COLORS.danger} />
              <Text style={styles.modalTitle}>Request Account Deletion</Text>
            </View>

            <Text style={styles.modalDescription}>
              {profile?.deletionRequested &&
              profile?.deletionRequestStatus === "rejected"
                ? "Your previous deletion request was rejected. You can submit a new request with additional details."
                : "Please tell us why you want to delete your account. Your request will be reviewed by an administrator."}
            </Text>

            <TextInput
              style={styles.reasonInput}
              placeholder="Enter reason for deletion..."
              value={deletionReason}
              onChangeText={setDeletionReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowDeletionModal(false);
                  setDeletionReason("");
                }}
                disabled={submittingDeletion}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSubmitButton,
                  submittingDeletion && styles.buttonDisabled,
                ]}
                onPress={submitDeletionRequest}
                disabled={submittingDeletion}
              >
                {submittingDeletion ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.modalSubmitText}>Submit Request</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // Rejected Banner Styles
  rejectedBanner: {
    backgroundColor: "#FEE2E2",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.danger,
  },
  rejectedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.danger,
    marginBottom: 2,
  },
  rejectedText: {
    fontSize: 14,
    color: "#991B1B",
  },
  // Warning Banner Styles (for pending)
  warningBanner: {
    backgroundColor: "#FEF3C7",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.warning,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.warning,
    marginBottom: 2,
  },
  warningText: {
    fontSize: 13,
    color: "#92400E",
  },
  statusContent: {
    flex: 1,
    marginLeft: 12,
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
  dangerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.danger,
    marginBottom: 15,
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: COLORS.danger,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.warning,
    padding: 13,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: COLORS.light,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelText: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: "600",
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: COLORS.danger,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  modalSubmitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default UserProfileScreen;
