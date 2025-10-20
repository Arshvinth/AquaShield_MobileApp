import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import { adminAPI, feoAPI } from "../../services/api";
import { COLORS } from "../../utils/constants";
import { useFocusEffect } from "@react-navigation/native";

const AdminDashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFEOs: 0,
    activeUsers: 0,
    pendingDeletions: 0,
  });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      const [statsResponse, feosResponse] = await Promise.all([
        adminAPI.getStats(),
        feoAPI.getAllFEOs(),
      ]);

      setStats({
        totalUsers: statsResponse.data.totalUsers,
        totalFEOs: feosResponse.data.count,
        activeUsers: statsResponse.data.activeUsers,
        pendingDeletions: statsResponse.data.pendingDeletions || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      Alert.alert("Error", "Failed to load dashboard data");
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
        <View>
          <Text style={styles.greeting}>Welcome Admin!</Text>
          <Text style={styles.subGreeting}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="log-out-outline" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Alert Banner for Deletion Requests */}
      {stats.pendingDeletions > 0 && (
        <TouchableOpacity
          style={styles.alertBanner}
          onPress={() => navigation.navigate("DeletionRequests")}
        >
          <Icon name="alert-circle" size={24} color={COLORS.danger} />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>
              {stats.pendingDeletions} Deletion Request
              {stats.pendingDeletions > 1 ? "s" : ""} Pending
            </Text>
            <Text style={styles.alertText}>Tap to review and take action</Text>
          </View>
          <Icon name="chevron-forward" size={24} color={COLORS.danger} />
        </TouchableOpacity>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#E3F2FD" }]}>
            <Icon name="people" size={32} color="#2196F3" />
          </View>
          <Text style={styles.statNumber}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#FFF3E0" }]}>
            <Icon name="shield" size={32} color="#FF9800" />
          </View>
          <Text style={styles.statNumber}>{stats.totalFEOs}</Text>
          <Text style={styles.statLabel}>Total FEOs</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#E8F5E9" }]}>
            <Icon name="checkmark-circle" size={32} color="#4CAF50" />
          </View>
          <Text style={styles.statNumber}>{stats.activeUsers}</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}>
            <Icon name="alert-circle" size={32} color="#EF4444" />
          </View>
          <Text style={styles.statNumber}>{stats.pendingDeletions}</Text>
          <Text style={styles.statLabel}>Deletion Requests</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("AddFEO")}
        >
          <View style={styles.actionIconContainer}>
            <Icon name="person-add" size={28} color={COLORS.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Add FEO Officer</Text>
            <Text style={styles.actionDescription}>
              Register a new Fisheries Enforcement Officer
            </Text>
          </View>
          <Icon name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("FEOList")}
        >
          <View style={styles.actionIconContainer}>
            <Icon name="list" size={28} color={COLORS.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage FEO Officers</Text>
            <Text style={styles.actionDescription}>
              View, edit, or remove FEO officers
            </Text>
          </View>
          <Icon name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("UserList")}
        >
          <View style={styles.actionIconContainer}>
            <Icon name="people-outline" size={28} color={COLORS.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage Users</Text>
            <Text style={styles.actionDescription}>
              View and manage registered users
            </Text>
          </View>
          <Icon name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        {/* NEW: Deletion Requests Quick Action */}
        <TouchableOpacity
          style={[
            styles.actionCard,
            stats.pendingDeletions > 0 && styles.actionCardAlert,
          ]}
          onPress={() => navigation.navigate("DeletionRequests")}
        >
          <View
            style={[
              styles.actionIconContainer,
              stats.pendingDeletions > 0 && styles.actionIconAlert,
            ]}
          >
            <Icon
              name="alert-circle"
              size={28}
              color={
                stats.pendingDeletions > 0 ? COLORS.danger : COLORS.primary
              }
            />
            {stats.pendingDeletions > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{stats.pendingDeletions}</Text>
              </View>
            )}
          </View>
          <View style={styles.actionContent}>
            <Text
              style={[
                styles.actionTitle,
                stats.pendingDeletions > 0 && styles.actionTitleAlert,
              ]}
            >
              Deletion Requests
            </Text>
            <Text style={styles.actionDescription}>
              {stats.pendingDeletions > 0
                ? `${stats.pendingDeletions} pending request${
                    stats.pendingDeletions > 1 ? "s" : ""
                  } awaiting review`
                : "No pending deletion requests"}
            </Text>
          </View>
          <Icon name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>System Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="server-outline" size={20} color={COLORS.gray} />
            <Text style={styles.infoText}>System running smoothly</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon
              name="shield-checkmark-outline"
              size={20}
              color={COLORS.success}
            />
            <Text style={styles.infoText}>All security checks passed</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="time-outline" size={20} color={COLORS.gray} />
            <Text style={styles.infoText}>Last backup: Today</Text>
          </View>
        </View>
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
    padding: 20,
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 4,
  },
  alertBanner: {
    backgroundColor: "#FEE2E2",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.danger,
    marginBottom: 10,
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.danger,
    marginBottom: 2,
  },
  alertText: {
    fontSize: 13,
    color: "#991B1B",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: "center",
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 15,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionCardAlert: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
    backgroundColor: "#FEF2F2",
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
  },
  actionIconAlert: {
    backgroundColor: "#FEE2E2",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 4,
  },
  actionTitleAlert: {
    color: COLORS.danger,
  },
  actionDescription: {
    fontSize: 13,
    color: COLORS.gray,
  },
  recentActivity: {
    padding: 20,
    paddingTop: 10,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.dark,
  },
});

export default AdminDashboardScreen;
