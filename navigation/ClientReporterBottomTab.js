import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // Added missing import

// Screens
import ClientHomeScreen from "../screens/clientReporter/clientHomeScreen";
import ClientReportIncident from "../screens/clientReporter/clientReportIncident";
import MyReport from "../screens/clientReporter/myReport";
import Notification from "../screens/clientReporter/Notification";
import ClientProfile from "../screens/clientReporter/ClientProfile";
import { useAuth } from '../context/AuthContext';
import UserProfileScreen from '../screens/user/UserProfileScreen';

const defaultProfileImage = require('../assets/profile.jpg');

// Header Component with Logout
const HeaderRight = ({ onLogout, onProfilePress, profileImage }) => {
    return (
        <View style={styles.headerRightContainer}>
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={onLogout}
            >
                <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />

            </TouchableOpacity>

            <TouchableOpacity
                style={styles.profileButton}
                onPress={onProfilePress}
            >
                <Image
                    source={profileImage || defaultProfileImage}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
        </View>
    );
};

const HeaderRightWithMenu = ({ onProfilePress, onLogout, profileImage }) => {
    const [showMenu, setShowMenu] = React.useState(false);

    const handleProfilePress = () => {
        setShowMenu(false);
        onProfilePress();
    };

    const handleLogoutPress = () => {
        setShowMenu(false);
        onLogout();
    };

    React.useEffect(() => {
        const closeMenu = () => setShowMenu(false);

        if (showMenu) {
            // Add a small delay to ensure the menu is rendered before adding the listener
            const timer = setTimeout(() => {
                // This will be handled by the TouchableOpacity's onPressOut
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [showMenu]);

    return (
        <View style={styles.headerRightContainer}>
            <TouchableOpacity
                style={styles.profileButton}
                onPress={() => setShowMenu(!showMenu)}
                activeOpacity={0.7}
            >
                <Image
                    source={profileImage || defaultProfileImage}
                    style={styles.profileImage}
                />
                {showMenu && (
                    <View style={styles.dropdownMenu}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleProfilePress}
                        >
                            <Ionicons name="person-outline" size={18} color="#333" />
                            <Text style={styles.menuText}>Profile</Text>
                        </TouchableOpacity>
                        <View style={styles.menuDivider} />

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleLogoutPress}
                        >
                            <Ionicons name="log-out-outline" size={18} color="#FF6B6B" />
                            <Text style={[styles.menuText, styles.logoutMenuText]}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
            {showMenu && (
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setShowMenu(false)}
                    activeOpacity={0}
                />
            )}
        </View>
    );
};

const Tab = createBottomTabNavigator();

// Custom Tab Bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
            <View style={styles.tabContainer}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;

                    // Middle tab: Report Incident
                    if (route.name === 'Report') {
                        return (
                            <TouchableOpacity
                                key={route.key}
                                style={styles.middleButton}
                                onPress={() => navigation.navigate('Report')}
                            >
                                <Ionicons name="flag" size={28} color="white" />
                            </TouchableOpacity>
                        );
                    }

                    const onPress = () => navigation.navigate(route.name);

                    let iconName;
                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'My Report') iconName = 'folder';
                    else if (route.name === 'Notification') iconName = 'notifications';
                    else if (route.name === 'Profile') iconName = 'person';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={styles.tabButton}
                            onPress={onPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={isFocused ? iconName : `${iconName}-outline`}
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
};

export default function ClientBottom() {
    const navigation = useNavigation(); // Added navigation hook

    const { logout, user } = useAuth();

    const [userProfileImage, setUserProfileImage] = React.useState(null);

    const HeaderComponent = HeaderRightWithMenu;

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        try {
                            await logout();
                            console.log("user log out from the system");

                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Login" }],
                            })
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

    const handleProfilePress = () => {
        // Navigate to profile screen
        navigation.navigate('UserProfile');
    };

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: "#146C94",
                tabBarInactiveTintColor: "#19A7CE",
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="My Report"
                component={MyReport}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                width: 120,
                                alignItems: "center",
                                justifyContent: "center",
                                top: 10,
                            }}
                        >
                            <Ionicons
                                name={
                                    focused ? "folder" : "folder-open-outline"
                                }
                                size={24}
                                color={focused ? "#146C94" : "#19A7CE"}
                            />
                            <Text
                                style={{
                                    color: focused ? "#146C94" : "#19A7CE",
                                    fontSize: 10,
                                    fontWeight: focused
                                        ? "bold"
                                        : "normal",
                                }}
                            >
                                My Report
                            </Text>
                        </View>
                    ),
                    header: (props) => (
                        <CustomHeader title="My Reports" {...props} />
                    ),
                }}
            />
            <Tab.Screen
                name="Report"
                component={ClientReportIncident}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                width: 120,
                                alignItems: "center",
                                justifyContent: "center",
                                top: 10,
                            }}
                        >
                            <Ionicons
                                name={focused ? "flag" : "flag-outline"}
                                size={24}
                                color={focused ? "#146C94" : "#19A7CE"}
                            />
                            <Text
                                style={{
                                    color: focused ? "#146C94" : "#19A7CE",
                                    fontSize: 10,
                                    fontWeight: focused
                                        ? "bold"
                                        : "normal",
                                }}
                            >
                                Report
                            </Text>
                        </View>
                    ),
                    header: (props) => (
                        <CustomHeader title="Report Incident" {...props} />
                    ),
                }}
            />
            <Tab.Screen
                name="Home"
                component={ClientHomeScreen}
                options={{
                    tabBarIcon: () => (
                        <View
                            style={{
                                position: "absolute",
                                alignItems: "center",
                                justifyContent: "center",
                                top: 20,
                                left: 20,
                            }}
                        >
                            <Ionicons name="home" size={30} color="#fff" />
                        </View>
                    ),
                    header: (props) => (
                        <CustomHeader title="Home" {...props} />
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    ),
                }}
            />
            <Tab.Screen
                name="Notification"
                component={Notification}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                width: 120,
                                alignItems: "center",
                                justifyContent: "center",
                                top: 10,
                            }}
                        >
                            <Ionicons
                                name={
                                    focused
                                        ? "notifications"
                                        : "notifications-outline"
                                }
                                size={24}
                                color={focused ? "#146C94" : "#19A7CE"}
                            />
                            <Text
                                style={{
                                    color: focused ? "#146C94" : "#19A7CE",
                                    fontSize: 10,
                                    fontWeight: focused
                                        ? "bold"
                                        : "normal",
                                }}
                            >
                                Notify
                            </Text>
                        </View>
                    ),
                    header: (props) => (
                        <CustomHeader title="Notification" {...props} />
                    ),
                }}
            />
            screenOptions={({ route }) => ({
                headerShown: true,
                headerTitle: getHeaderTitle(route.name),
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#146C94',
                },
                headerStyle: {
                    backgroundColor: '#FFFFFF',
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerRight: () => (
                    <HeaderComponent
                        onProfilePress={handleProfilePress}
                        onLogout={handleLogout}
                        profileImage={userProfileImage}
                    />
                ),
                headerTitleAlign: 'left',
            })}
            tabBar={props => <CustomTabBar {...props} />}

            <Tab.Screen name="Home" component={ClientHomeScreen} />
            <Tab.Screen name="My Report" component={MyReport} />
            <Tab.Screen name="Report" component={ClientReportIncident} />
            <Tab.Screen name="Notification" component={Notification} />
            <Tab.Screen
                name="Profile"
                component={UserProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                width: 120,
                                alignItems: "center",
                                justifyContent: "center",
                                top: 10,
                            }}
                        >
                            <Ionicons
                                name={focused ? "person" : "person-outline"}
                                size={24}
                                color={focused ? "#146C94" : "#19A7CE"}
                            />
                            <Text
                                style={{
                                    color: focused ? "#146C94" : "#19A7CE",
                                    fontSize: 10,
                                    fontWeight: focused
                                        ? "bold"
                                        : "normal",
                                }}
                            >
                                Profile
                            </Text>
                        </View>
                    ),
                    header: (props) => <CustomHeader title="My Profile" {...props} />,
                    headerRight: null, // Hide header right on profile page if needed
                }}
            />
        </Tab.Navigator>
    );
}

// Helper function for header titles
const getHeaderTitle = (routeName) => {
    switch (routeName) {
        case 'Home':
            return 'Home';
        case 'My Report':
            return 'My Reports';
        case 'Report':
            return 'Report Incident';
        case 'Notification':
            return 'Notifications';
        case 'Profile':
            return 'My Profile';
        default:
            return routeName;
    }
};

const styles = StyleSheet.create({
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 40,
        paddingHorizontal: 10,
        backgroundColor: "#FFFFFF",
    },
    headerTitle: {
        color: "#146C94",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "left",
        marginLeft: 10,
        flex: 1,
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
            marginTop: 10,
        },
        middleButton: {
            width: 65,
            height: 65,
            borderRadius: 32,
            backgroundColor: '#146C94',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: Platform.OS === 'android' ? 20 : 10,
            shadowColor: '#146C94',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 6,
        },
        logoutButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFF5F5',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            marginRight: 10,
            borderWidth: 1,
            borderColor: '#FFE0E0',
        },
        logoutText: {
            color: '#FF6B6B',
            fontSize: 12,
            fontWeight: 'bold',
            marginLeft: 4,
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
            borderWidth: 2,
            borderColor: '#FFFFFF',
        }

    },

    // Dropdown Menu Styles (needed for HeaderRightWithMenu)
    dropdownMenu: {
        position: 'absolute',
        top: 45,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 0,
        minWidth: 140,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
    profileImages: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    researcherButton: {
        backgroundColor: "#19A7CE",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginRight: 10,
    },
    researcherButtonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
});
