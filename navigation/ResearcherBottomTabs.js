// navigation/BottomTabs.js
// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import researcherDashboard from '../screens/researcherDashboard';
// import researcherSpeciesRequests from '../screens/researcherSpeciesRequests';
// import addSpeciesRequest from '../screens/addSpeciesRequest';
// import SearchSpecies from '../screens/SearchSpecies';
// import SpeciesReports from '../screens/SpeciesReports';
// import ResearcherFavorites from '../screens/researcherFavorites';
// import { useNavigation } from '@react-navigation/native'; 


// const Tab = createBottomTabNavigator();

// // Custom Tab Bar
// const CustomTabBar = ({ state, descriptors, navigation }) => {
//   return (
//     <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
//       <View style={styles.tabContainer}>
//         {state.routes.map((route, index) => {
//           const isFocused = state.index === index;

//           // Middle tab: Search
//           if (route.name === 'Search') {
//             return (
//               <TouchableOpacity
//                 key={route.key}
//                 style={styles.middleButton}
//                 onPress={() => navigation.navigate('Search')}
//               >
//                 <MaterialIcons name="search" size={28} color="white" />
//               </TouchableOpacity>
//             );
//           }

//           const onPress = () => navigation.navigate(route.name);

//           let iconName;
//           if (route.name === 'Home') iconName = 'home';
//           else if (route.name === 'Requests') iconName = 'file-tray-full';
//           else if (route.name === 'Reports') iconName = 'stats-chart';
//           else if (route.name === 'Favorites') iconName = 'heart';

//           return (
//             <TouchableOpacity
//               key={route.key}
//               style={styles.tabButton}
//               onPress={onPress}
//               activeOpacity={0.7}
//             >
//               <Ionicons
//                 name={iconName}
//                 size={24}
//                 color={isFocused ? '#1E90FF' : 'gray'}
//               />
//               <Text style={{ color: isFocused ? '#1E90FF' : 'gray', fontSize: 12 }}>
//                 {route.name}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default function BottomTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: true,
//         headerTitle: route.name, // dynamic title based on tab
//         headerTitleStyle: {
//           fontSize: 20,
//           fontWeight: 'bold',
//           color: '#333',
//         }, 
//         headerRight: ({ navigation }) => (
//           <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
//             {/* Notification Icon */}
//             <TouchableOpacity onPress={() => navigation.navigate('Search')}>
//               <Ionicons
//                 name="notifications-outline"
//                 size={24}
//                 color="rgba(30,144,255,0.8)"
//                 style={{ marginRight: 10 }}
//               />
//             </TouchableOpacity>
            
//             {/* Existing Aquashield Text */}
//             <Text
//               style={{
//                 fontWeight: 'bold',
//                 color: 'rgba(30,144,255,0.5)',
//                 fontSize: 18,
//               }}
//             >
//               Aquashield
//             </Text>
//           </View>
//         ),

//       })}
//       tabBar={props => <CustomTabBar {...props} />}
//     >
//       <Tab.Screen name="Home" component={researcherDashboard} />
//       <Tab.Screen name="Requests" component={researcherSpeciesRequests} />
//       <Tab.Screen name="Search" component={SearchSpecies} />
//       <Tab.Screen name="Reports" component={SpeciesReports} />
//       <Tab.Screen name="Favorites" component={ResearcherFavorites} />
//     </Tab.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   tabContainer: {
//     flexDirection: 'row',
//     height: 70,
//     backgroundColor: '#F6F1F1',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#AFD3E2',
//     paddingBottom: Platform.OS === 'android' ? 10 : 0,
//   },
//   tabButton: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   middleButton: {
//     width: 65,
//     height: 65,
//     borderRadius: 32,
//     backgroundColor: '#19A7CE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: Platform.OS === 'android' ? 20 : 10,
//     shadowColor: '#146C94',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 6,
//   },
// });

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Screens
import researcherDashboard from '../screens/researcherDashboard';
import researcherSpeciesRequests from '../screens/researcherSpeciesRequests';
import SearchSpecies from '../screens/SearchSpecies';
import SpeciesReports from '../screens/SpeciesReports';
import ResearcherFavorites from '../screens/researcherFavorites';

// Header Component
import HeaderRight from '../components/HeaderRight';

const Tab = createBottomTabNavigator();

// Custom Tab Bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          // Middle tab: Search
          if (route.name === 'Search') {
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.middleButton}
                onPress={() => navigation.navigate('Search')}
              >
                <MaterialIcons name="search" size={28} color="white" />
              </TouchableOpacity>
            );
          }

          const onPress = () => navigation.navigate(route.name);

          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Requests') iconName = 'file-tray-full';
          else if (route.name === 'Reports') iconName = 'stats-chart';
          else if (route.name === 'Favorites') iconName = 'heart';

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabButton}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? '#1E90FF' : 'gray'}
              />
              <Text style={{ color: isFocused ? '#1E90FF' : 'gray', fontSize: 12 }}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: route.name,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#333',
        },
        headerRight: () => <HeaderRight />, // Use custom header component
      })}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={researcherDashboard} />
      <Tab.Screen name="Requests" component={researcherSpeciesRequests} />
      <Tab.Screen name="Search" component={SearchSpecies} />
      <Tab.Screen name="Reports" component={SpeciesReports} />
      <Tab.Screen name="Favorites" component={ResearcherFavorites} />
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
    marginTop: 10,
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
