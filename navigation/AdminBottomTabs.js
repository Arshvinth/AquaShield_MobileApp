import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Admin Screens (you'll create these)
import AdminDashboard from '../screens/AdminDashboard';
import AdminUsers from '../screens/AdminUsers';
import AdminReports from '../screens/AdminReports';
import AdminAddFEO from '../screens/AdminAddFEO';
import AdminAnalytics from '../screens/AdminAnalytics';

const Tab = createBottomTabNavigator();

// Custom Tab Bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Middle tab: Dashboard
          if (route.name === 'Dashboard') {
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.middleButton}
                onPress={() => navigation.navigate('Dashboard')}
              >
                <MaterialIcons name="dashboard" size={28} color="white" />
              </TouchableOpacity>
            );
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName;
          let iconType = 'ionicons'; // default to Ionicons

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
            iconType = 'material';
          } else if (route.name === 'Analytics') {
            iconName = 'analytics';
          } else if (route.name === 'Users') {
            iconName = 'people';
          } else if (route.name === 'Reports') {
            iconName = 'document-text';
          } else if (route.name === 'Add FEO') {
            iconName = 'add-circle';
          }

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabButton}
              onPress={onPress}
              activeOpacity={0.7}
            >
              {iconType === 'material' ? (
                <MaterialIcons
                  name={iconName}
                  size={24}
                  color={isFocused ? '#146C94' : 'gray'}
                />
              ) : (
                <Ionicons
                  name={iconName}
                  size={24}
                  color={isFocused ? '#146C94' : 'gray'}
                />
              )}
              <Text style={[styles.tabText, isFocused && styles.activeTabText]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default function AdminBottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // We'll use our custom header in Layout
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Analytics" component={AdminAnalytics} />
      <Tab.Screen name="Users" component={AdminUsers} />
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Reports" component={AdminReports} />
      <Tab.Screen name="Add FEO" component={AdminAddFEO} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  activeTabText: {
    color: '#146C94',
    fontWeight: '600',
  },
  middleButton: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: '#19A7CE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 20 : 10,
    shadowColor: '#146C94',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});