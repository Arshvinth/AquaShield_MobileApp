import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import * as Font from 'expo-font';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import LandingPage from './screens/researcherLandingPage';
import LaunchPage from './screens/LaunchScreen';
import onBoarding1 from './screens/onBoarding1';
import onBoarding2 from './screens/onBoarding2';
import onBoarding3 from './screens/onBoarding3';

import ResearcherBottomTabsBottomTabs from './navigation/ResearcherBottomTabs';
import AddSpeciesRequest from './screens/addSpeciesRequest';
import ViewOneSpecies from './screens/viewOneSpecies';
import ResearcherNotifications from './screens/researcherNotifications';
import EditResearcherRequest from './screens/editResearcherRequest';
import viewOneSpecies from './screens/viewOneSpecies';

import ClientBottom from './navigation/ClientReporterBottomTab';
import useNetworkStatus from './src/hooks/useNetworkStatus';
import FeoBottom from './navigation/FEOBottomNavigation';

import AdminBottomTabs from './navigation/AdminBottomTabs';

//Test Ashwin
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";
import { COLORS } from "./utils/constants";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  // React.useEffect(() => {
  //   async function loadFonts() {
  //     await Font.loadAsync({
  //       ...Ionicons.font,
  //       ...MaterialCommunityIcons.font,
  //       ...MaterialIcons.font, // preload MaterialIcons
  //     });
  //     setFontsLoaded(true);
  //   }
  //   loadFonts();
  // }, []);

  if (!fontsLoaded) {
    // return (
    //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //     <ActivityIndicator size="large" color="#146C94" />
    //   </View> 
    // );
  }

  useNetworkStatus();

  // Your original navigation structure remains untouched
  return (
    // <>
    //   <NavigationContainer>
    //     <Stack.Navigator>
    //       {/* <Stack.Screen
    //         name="loginUI"
    //         component={LoginScreen}
    //         options={{ headerShown: false }}
    //       /> */}
    //       {/* Admin Bottom Tabs as the main navigation */}
    //       {/* <Stack.Screen
    //         name="AdminTabs"
    //         component={AdminBottomTabs}
    //         options={{ headerShown: false }}
    //       /> */}

    //       {/* Tabs as the main navigation
    // <NavigationContainer>
    //   <ClientBottom />
    //   <Stack.Navigator>
    //     <Stack.Screen
    //       name="LaunchPage"
    //       component={LaunchPage}
    //       options={{ headerShown: false }}
    //     />
    //      <Stack.Screen
    //       name="onBoarding1"
    //       component={onBoarding1}
    //       options={{ headerShown: false }}
    //     />
    //     <Stack.Screen
    //       name="onBoarding2"
    //       component={onBoarding2}
    //       options={{ headerShown: false }}
    //     />
    //     <Stack.Screen
    //       name="onBoarding3"
    //       component={onBoarding3}
    //       options={{ headerShown: false }}
    //     />
    //     <Stack.Screen
    //       name="LandingPage"
    //       component={LandingPage}
    //       options={{ headerShown: false }}
    //     />
    //     <Stack.Screen
    //       name="ResearcherTabs"
    //       component={ResearcherBottomTabsBottomTabs}
    //       options={{ headerShown: false }}
    //     /> */}
    //       {/* Extra screen for new species request */}
    //       {/* <Stack.Screen 
    //     />
    //     <Stack.Screen
    //       name="AddSpeciesRequest"
    //       component={AddSpeciesRequest}
    //       options={{ title: 'Add Species Request' }}
    //     />
    //     <Stack.Screen
    //       name="ViewOneSpecies"
    //       component={ViewOneSpecies}
    //       options={{ headerShown: true }}
    //     />
    //     <Stack.Screen
    //       name="ResearcherNotifications"
    //       component={ResearcherNotifications}
    //       options={{
    //         headerShown: true,
    //         headerTitle: 'Notifications',
    //         headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
    //       }}
    //     />
    //     <Stack.Screen
    //       name="EditRequest"
    //       component={EditResearcherRequest}
    //       options={({ route }) => ({
    //         title: route.params?.speciesId
    //           ? 'Edit Species Request'
    //           : 'Add Species Request',
    //       })}
    //     />
    //     <Stack.Screen
    //       name="viewOneSpecies"
    //       component={viewOneSpecies}
    //       options={({ route }) => ({
    //         title: route.params?.speciesId ? 'View Species' : 'Search Species',
    //       })}
    //     /> */}
    //     </Stack.Navigator>
    //   </NavigationContainer>
    //   <Toast />
    // </>
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <AppNavigator />
      </SafeAreaView>
    </AuthProvider>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
