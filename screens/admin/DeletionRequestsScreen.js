import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Ionicons";
import { adminAPI } from "../../services/api";
import { COLORS } from "../../utils/constants";
import { useFocusEffect } from "@react-navigation/native";

const DeletionRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'approved', 'rejected'
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  useFocusEffect(
    useCallback(() => {
      loadDeletionRequests();
    }, [filter])
  );

  const loadDeletionRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDeletionRequests(filter);
      setRequests(response.data.requests);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error loading deletion requests:", error);
      Alert.alert("Error", "Failed to load deletion requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request) => {
    if (request.deletionRequestStatus !== "pending") {
      Alert.alert("Error", "This request has already been processed");
      return;
    }

    Alert.alert(
      "Approve Deletion",
      `Are you sure you want to approve the deletion request from ${request.firstName} ${request.lastName}?\n\nThis will deactivate their account.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          style: "destructive",
          onPress: async () => {
            try {
              setProcessingId(request._id);
              await adminAPI.approveDeletion(request._id);
              Alert.alert("Success", "Deletion request approved");
              loadDeletionRequests();
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to approve request"
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const handleReject = (request) => {
    if (request.deletionRequestStatus !== "pending") {
      Alert.alert("Error", "This request has already been processed");
      return;
    }

    Alert.alert(
      "Reject Deletion Request",
      `Are you sure you want to reject the deletion request from ${request.firstName} ${request.lastName}?\n\nThe user's account will remain active.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          onPress: async () => {
            try {
              setProcessingId(request._id);
              await adminAPI.rejectDeletion(request._id);
              Alert.alert("Success", "Deletion request rejected");
              loadDeletionRequests();
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to reject request"
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: "time",
          color: COLORS.warning,
          bgColor: "#FEF3C7",
          text: "Pending",
        };
      case "approved":
        return {
          icon: "checkmark-circle",
          color: COLORS.danger,
          bgColor: "#FEE2E2",
          text: "Approved",
        };
      case "rejected":
        return {
          icon: "close-circle",
          color: COLORS.gray,
          bgColor: "#F3F4F6",
          text: "Rejected",
        };
      default:
        return {
          icon: "help-circle",
          color: COLORS.gray,
          bgColor: COLORS.light,
          text: "Unknown",
        };
    }
  };

  const renderRequestItem = ({ item }) => {
    const statusBadge = getStatusBadge(item.deletionRequestStatus);
    const isPending = item.deletionRequestStatus === "pending";

    return (
      <View
        style={[styles.requestCard, !isPending && styles.requestCardProcessed]}
      >
        <View style={styles.requestHeader}>
          <View style={styles.userInfo}>
            {item.profileImage?.base64 ? (
              <Image
                source={{
                  uri: `data:image/jpeg;base64,${item.profileImage.base64}`,
                }}
                style={styles.avatar}
              />
            ) : item.profileImage?.url ? (
              <Image
                source={{ uri: item.profileImage.url }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={30} color={COLORS.white} />
              </View>
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.requestDate}>
                Requested: {formatDate(item.deletionRequestedAt)}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusBadge.bgColor },
            ]}
          >
            <Icon name={statusBadge.icon} size={18} color={statusBadge.color} />
            <Text style={[styles.statusText, { color: statusBadge.color }]}>
              {statusBadge.text}
            </Text>
          </View>
        </View>

        <View style={styles.requestBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact:</Text>
            <Text style={styles.infoValue}>{item.contactNo || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Joined:</Text>
            <Text style={styles.infoValue}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          {item.deletionReason && (
            <View style={styles.reasonContainer}>
              <Text style={styles.reasonLabel}>Reason for deletion:</Text>
              <Text style={styles.reasonText}>{item.deletionReason}</Text>
            </View>
          )}

          {/* Show processing info for processed requests */}
          {!isPending && item.deletionProcessedAt && (
            <View style={styles.processedContainer}>
              <Icon name="information-circle" size={16} color={COLORS.gray} />
              <View style={styles.processedInfo}>
                <Text style={styles.processedText}>
                  {item.deletionRequestStatus === "approved"
                    ? "Approved"
                    : "Rejected"}{" "}
                  on {formatDate(item.deletionProcessedAt)}
                </Text>
                {item.deletionProcessedBy && (
                  <Text style={styles.processedByText}>
                    By: {item.deletionProcessedBy.firstName}{" "}
                    {item.deletionProcessedBy.lastName}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Action buttons - only show for pending requests */}
        {isPending ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.approveButton,
                processingId === item._id && styles.buttonDisabled,
              ]}
              onPress={() => handleApprove(item)}
              disabled={processingId === item._id}
            >
              {processingId === item._id ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Icon
                    name="checkmark-circle"
                    size={20}
                    color={COLORS.white}
                  />
                  <Text style={styles.buttonText}>Approve</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.rejectButton,
                processingId === item._id && styles.buttonDisabled,
              ]}
              onPress={() => handleReject(item)}
              disabled={processingId === item._id}
            >
              <Icon name="close-circle" size={20} color={COLORS.primary} />
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.processedBanner}>
            <Icon name={statusBadge.icon} size={20} color={statusBadge.color} />
            <Text
              style={[styles.processedBannerText, { color: statusBadge.color }]}
            >
              This request has been {item.deletionRequestStatus}
            </Text>
          </View>
        )}
      </View>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Deletion Requests</Text>
        <TouchableOpacity onPress={loadDeletionRequests}>
          <Icon name="refresh" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Filter Picker */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Status:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={filter}
            onValueChange={(value) => setFilter(value)}
            style={styles.picker}
          >
            <Picker.Item label="All Requests" value="all" />
            <Picker.Item label={`Pending (${stats.pending})`} value="pending" />
            <Picker.Item
              label={`Approved (${stats.approved})`}
              value="approved"
            />
            <Picker.Item
              label={`Rejected (${stats.rejected})`}
              value="rejected"
            />
          </Picker>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statPending]}>
          <Icon name="time" size={24} color={COLORS.warning} />
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, styles.statApproved]}>
          <Icon name="checkmark-circle" size={24} color={COLORS.danger} />
          <Text style={styles.statNumber}>{stats.approved}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={[styles.statCard, styles.statRejected]}>
          <Icon name="close-circle" size={24} color={COLORS.gray} />
          <Text style={styles.statNumber}>{stats.rejected}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="checkmark-done-circle"
              size={64}
              color={COLORS.success}
            />
            <Text style={styles.emptyTitle}>No Requests Found</Text>
            <Text style={styles.emptyText}>
              {filter === "pending"
                ? "No pending deletion requests"
                : filter === "approved"
                ? "No approved deletion requests"
                : filter === "rejected"
                ? "No rejected deletion requests"
                : "No deletion requests at all"}
            </Text>
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
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  statsRow: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statPending: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  statApproved: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  statRejected: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gray,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.dark,
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  listContainer: {
    padding: 15,
  },
  requestCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestCardProcessed: {
    borderLeftColor: COLORS.gray,
    opacity: 0.8,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  avatarPlaceholder: {
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
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 11,
    color: COLORS.gray,
    fontStyle: "italic",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    height: 32,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  requestBody: {
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.dark,
    flex: 1,
    fontWeight: "500",
  },
  reasonContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: COLORS.light,
    borderRadius: 8,
  },
  reasonLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  processedContainer: {
    marginTop: 10,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gray,
  },
  processedInfo: {
    marginLeft: 8,
    flex: 1,
  },
  processedText: {
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: "500",
  },
  processedByText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },
  approveButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.danger,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.light,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    marginLeft: 6,
  },
  rejectButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    marginLeft: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  processedBanner: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: COLORS.light,
    borderRadius: 8,
  },
  processedBannerText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 15,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
  },
});

export default DeletionRequestsScreen;
