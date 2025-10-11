import React from "react";
import { TouchableOpacity, StyleSheet, View, Text, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import feoReports from "../screens/feo/feoReports";
import feoHome from "../screens/feo/feoHome";
import feoProfile from "../screens/feo/feoProfile";
import Notification from "../screens/clientReporter/Notification";

const Tab = createBottomTabNavigator();

const profileImage = require('../assets/profile.jpg');

const FeoTabBarButton = ({ children, onPress }) => (

    <TouchableOpacity
        style={{
            top: -20,
            position: "relative",
            justifyContent: "center",
            alignItems: "center",

            ...styles.shadow,
        }}
        onPress={onPress}>
        <View
            style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#146C94",
            }}
        >
            {children}
        </View>
    </TouchableOpacity>

);

const FeoHeader = ({ title, showProfile = true }) => (
    <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
            {title}

        </Text>
        {showProfile && (
            <TouchableOpacity style={styles.profileButton}>
                <Image
                    source={profileImage}
                    style={styles.profileImages}
                />
            </TouchableOpacity>
        )}
    </View>
);

export default function FeoBottom() {
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
                name="Analytics"
                component={feoReports}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ width: 120, alignItems: "center", justifyContent: "center", top: 10 }}>
                            <Ionicons
                                name={focused ? "stats-chart" : "stats-chart-outline"}
                                size={24}
                                color={focused ? "#146C94" : "#19A7CE"}
                            />
                            <Text style={{ color: focused ? "#146C94" : "#19A7CE", fontSize: 10, fontWeight: focused ? "bold" : "normal", }}>
                                Analytics
                            </Text>
                        </View>
                    ),
                    header: (props) => <FeoHeader title="Report Analytics" {...props} />
                }}
            />
            <Tab.Screen
                name="Report"
                component={feoReports}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ width: 120, alignItems: "center", justifyContent: "center", top: 10 }}>
                            <Ionicons
                                name={focused ? "flag" : "flag-outline"}
                                size={24}
                                color={focused ? "#146C94" : "#19A7CE"}
                            />
                            <Text style={{ color: focused ? "#146C94" : "#19A7CE", fontSize: 10, fontWeight: focused ? "bold" : "normal" }}>
                                Report
                            </Text>
                        </View>
                    ),
                    header: (props) => <FeoHeader title="Reports" {...props} />
                }}
            />
            <Tab.Screen
                name="Home"
                component={feoHome}
                options={{
                    tabBarIcon: () => (
                        <View style={{ position: "absolute", alignItems: "center", justifyContent: "center", top: 20, left: 20 }}>
                            <Ionicons name="home" size={30} color="#fff" />
                        </View>

                    ),
                    header: (props) => <FeoHeader title="Home" {...props} />,
                    tabBarButton: (props) => <FeoTabBarButton {...props} />,
                }}
            />
            <Tab.Screen
                name="Notification"
                component={Notification}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ width: 120, alignItems: "center", justifyContent: "center", top: 10 }}>
                            <Ionicons
                                name={focused ? "notifications" : "notifications-outline"}
                                size={24}
                                color={focused ? "#146C94" : "#19A7CE"}

                            />
                            <Text style={{ color: focused ? "#146C94" : "#19A7CE", fontSize: 10, fontWeight: focused ? "bold" : "normal" }} >
                                Notify
                            </Text>
                        </View>
                    ),
                    header: (props) => <FeoHeader title="Notification" {...props} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={feoProfile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ width: 120, alignItems: "center", justifyContent: "center", top: 10 }}>
                            <Ionicons
                                name={focused ? "person" : "person-outline"}
                                size={24}
                                color={focused ? "#146C94" : "#19A7CE"}
                            />
                            <Text style={{ color: focused ? "#146C94" : "#19A7CE", fontSize: 10, fontWeight: focused ? "bold" : "normal" }}>
                                Profile
                            </Text>
                        </View>
                    ),
                    header: (props) => <FeoHeader title="My Profile" {...props} />
                }}
            />

        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#146C94",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: '100%',
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


    },
    profileButton: {
        padding: 5,
    },
    profileImages: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    }
});