// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import ResearcherBottomTabsBottomTabs from './navigation/ResearcherBottomTabs';
// import AddSpeciesRequest from './screens/addSpeciesRequest';
// import ViewOneSpecies from './screens/viewOneSpecies';
// import ResearcherNotifications from './screens/researcherNotifications';
// import EditResearcherRequest from './screens/editResearcherRequest';
// import viewOneSpecies from './screens/viewOneSpecies';
// import LandingPage from './screens/researcherLandingPage';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//          {/* Tabs as the main navigation */}
//         <Stack.Screen
//           name="LandingPage"
//           component={LandingPage}
//           options={{ headerShown: false }}
//         />

//         {/* Tabs as the main navigation */}
//         <Stack.Screen
//           name="ResearcherTabs"
//           component={ResearcherBottomTabsBottomTabs}
//           options={{ headerShown: false }}
//         />
//         {/* Extra screen for new species request */}
//         <Stack.Screen 
//           name="AddSpeciesRequest"
//           component={AddSpeciesRequest}
//           options={{ title: 'Add Species Request' }}
//         />
//         <Stack.Screen
//           name="ViewOneSpecies"
//           component={ViewOneSpecies}
//           options={{ headerShown: true }}
//         />
//         <Stack.Screen
//           name="ResearcherNotifications"
//           component={ResearcherNotifications}
//           options={{
//             headerShown: true,
//             headerTitle: 'Notifications',
//             headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
//           }}
//         />
//         <Stack.Screen 
//           name="EditRequest" 
//           component={EditResearcherRequest} 
//           options={({ route }) => ({
//             title: route.params?.speciesId ? 'Edit Species Request' : 'Add Species Request'
//           })}
//         />
//         <Stack.Screen 
//           name="viewOneSpecies" 
//           component={viewOneSpecies} 
//           options={({ route }) => ({
//             title: route.params?.speciesId ? 'View Species' : 'Search Species'
//           })}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import ResearcherBottomTabsBottomTabs from './navigation/ResearcherBottomTabs';
import AddSpeciesRequest from './screens/addSpeciesRequest';
import ViewOneSpecies from './screens/viewOneSpecies';
import ResearcherNotifications from './screens/researcherNotifications';
import EditResearcherRequest from './screens/editResearcherRequest';
import viewOneSpecies from './screens/viewOneSpecies';
import LandingPage from './screens/researcherLandingPage';


const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        ...Ionicons.font,
        ...MaterialCommunityIcons.font,
        ...MaterialIcons.font, // preload MaterialIcons
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#146C94" />
      </View>
    );
  }

  // Your original navigation structure remains untouched
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResearcherTabs"
          component={ResearcherBottomTabsBottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddSpeciesRequest"
          component={AddSpeciesRequest}
          options={{ title: 'Add Species Request' }}
        />
        <Stack.Screen
          name="ViewOneSpecies"
          component={ViewOneSpecies}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ResearcherNotifications"
          component={ResearcherNotifications}
          options={{
            headerShown: true,
            headerTitle: 'Notifications',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
          }}
        />
        <Stack.Screen
          name="EditRequest"
          component={EditResearcherRequest}
          options={({ route }) => ({
            title: route.params?.speciesId
              ? 'Edit Species Request'
              : 'Add Species Request',
          })}
        />
        <Stack.Screen
          name="viewOneSpecies"
          component={viewOneSpecies}
          options={({ route }) => ({
            title: route.params?.speciesId ? 'View Species' : 'Search Species',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

