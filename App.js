
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ResearcherBottomTabsBottomTabs from './navigation/ResearcherBottomTabs';
import ClientBottom from './navigation/ClientReporterBottomTab';
import useNetworkStatus from './src/hooks/useNetworkStatus';

export default function App() {

  useNetworkStatus();
  return (
    <NavigationContainer>
      {/*<ResearcherBottomTabsBottomTabs />*/}
      <ClientBottom />
    </NavigationContainer>
  );
}
