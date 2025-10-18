import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../utils/constants";

const HeaderRight = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout, style: "destructive" },
    ]);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
      {/* Notification Icon */}
      <TouchableOpacity onPress={() => navigation.navigate('ResearcherNotifications')}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="rgba(30,144,255,0.8)"
          style={{ marginRight: 10 }}
        />
      </TouchableOpacity>

      {/* Aquashield text */}
      <Text
        style={{
          fontWeight: 'bold',
          color: 'rgba(30,144,255,0.5)',
          fontSize: 18,
        }}
      >
        Aquashield
      </Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  }
});

export default HeaderRight;

