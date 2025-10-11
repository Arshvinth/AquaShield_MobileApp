import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
// import ResearcherBottomTabsBottomTabs from './navigation/ResearcherBottomTabs';
// import AddSpeciesRequest from './screens/addSpeciesRequest';
// import ViewOneSpecies from './screens/viewOneSpecies';
// import ResearcherNotifications from './screens/researcherNotifications';
// import EditResearcherRequest from './screens/editResearcherRequest';
import AdminBottomTabs from './navigation/AdminBottomTabs';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Admin Bottom Tabs as the main navigation */}
          <Stack.Screen
            name="AdminTabs"
            component={AdminBottomTabs}
            options={{ headerShown: false }}
          />

          {/* Tabs as the main navigation
        <Stack.Screen
          name="ResearcherTabs"
          component={ResearcherBottomTabsBottomTabs}
          options={{ headerShown: false }}
        /> */}
          {/* Extra screen for new species request */}
          {/* <Stack.Screen 
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
            title: route.params?.speciesId ? 'Edit Species Request' : 'Add Species Request'
          })}
        /> */}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
