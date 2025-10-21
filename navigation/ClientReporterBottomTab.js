import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

// Screens
import ClientHomeScreen from "../screens/clientReporter/clientHomeScreen";
import ClientReportIncident from "../screens/clientReporter/clientReportIncident";
import MyReport from "../screens/clientReporter/myReport";
import Notification from "../screens/clientReporter/Notification";
import UserProfileScreen from "../screens/user/UserProfileScreen";

const defaultProfileImage = require('../assets/profile.jpg');

const Tab = createBottomTabNavigator();

/* ---------------------- Header Right with Menu ---------------------- */
const HeaderRightWithMenu = ({ onProfilePress, onLogout, profileImage }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <View style={styles.headerRightContainer}>
      <TouchableOpacity style={styles.profileButton} onPress={toggleMenu} activeOpacity={0.7}>
        <Image source={profileImage || defaultProfileImage} style={styles.profileImage} />
      </TouchableOpacity>

      {showMenu && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); onProfilePress(); }}>
            <Ionicons name="person-outline" size={18} color="#333" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); onLogout(); }}>
            <Ionicons name="log-out-outline" size={18} color="#FF6B6B" />
            <Text style={[styles.menuText, styles.logoutMenuText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

/* ---------------------- Custom Header ---------------------- */
const CustomHeader = ({ title }) => (
  <View style={styles.customHeader}>
    <Text style={styles.customHeaderTitle}>{title}</Text>
  </View>
);

/* ---------------------- Custom Tab Bar ---------------------- */
const CustomTabBar = ({ state, navigation }) => (
  <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => navigation.navigate(route.name);

        const icons = {
          Home: 'home',
          'My Report': 'folder',
          Report: 'flag',
          Notification: 'notifications',
          Profile: 'person',
        };

        return (
          <TouchableOpacity key={route.key} style={styles.tabButton} onPress={onPress}>
            <Ionicons
              name={isFocused ? icons[route.name] : `${icons[route.name]}-outline`}
              size={24}
              color={isFocused ? '#146C94' : '#19A7CE'}
            />
            <Text style={{
              color: isFocused ? '#146C94' : '#19A7CE',
              fontSize: 12,
              fontWeight: isFocused ? 'bold' : 'normal'
            }}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </SafeAreaView>
);

/* ---------------------- Main Bottom Tab ---------------------- */
export default function ClientBottom() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [userProfileImage, setUserProfileImage] = React.useState(null);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleProfilePress = () => navigation.navigate('UserProfile');

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        header: () => <CustomHeader title={getHeaderTitle(route.name)} />,
        headerRight: () => (
          <HeaderRightWithMenu
            onProfilePress={handleProfilePress}
            onLogout={handleLogout}
            profileImage={userProfileImage}
          />
        ),
        headerTitleAlign: 'left',
      })}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={ClientHomeScreen} />
      <Tab.Screen name="My Report" component={MyReport} />
      <Tab.Screen name="Report" component={ClientReportIncident} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}

/* ---------------------- Helper ---------------------- */
const getHeaderTitle = (routeName) => {
  switch (routeName) {
    case 'Home': return 'Home';
    case 'My Report': return 'My Reports';
    case 'Report': return 'Report Incident';
    case 'Notification': return 'Notifications';
    case 'Profile': return 'My Profile';
    default: return routeName;
  }
};

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  profileButton: {
    padding: 2,
    borderWidth: 2,
    borderColor: '#146C94',
    borderRadius: 20,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  customHeader: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop:20
  },
  customHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#146C94",
  },
  tabContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#F6F1F1',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#AFD3E2',
    paddingBottom: Platform.OS === 'android' ? 10 : 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  logoutMenuText: {
    color: '#FF6B6B',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4,
  },
});
