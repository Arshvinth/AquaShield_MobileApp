import React, { useState, useEffect } from 'react';
import { 
  View, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar, 
  StyleSheet, 
  LogBox 
} from 'react-native';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { COLORS } from './utils/constants';
import useNetworkStatus from './src/hooks/useNetworkStatus';

LogBox.ignoreLogs(['Setting a timer']); 

export default function App() {
  const [assetsReady, setAssetsReady] = useState(false);

  useNetworkStatus();

  useEffect(() => {
    const loadAssets = async () => {
      try {
        console.log('Loading fonts...');
        await Font.loadAsync({
          ...Ionicons.font,
          ...MaterialIcons.font,
          ...MaterialCommunityIcons.font,
        });
        console.log('Fonts loaded.');

        console.log('Loading images...');
        await Asset.loadAsync([
          require('./assets/AppImages/TopOnboard1.png'),
          require('./assets/AppImages/TopOnboard2.png'),
          require('./assets/AppImages/TopOnboard3.png'),
          require('./assets/AppImages/AquaShieldLogo.png'),
        ]);
        console.log('Images loaded.');

        setAssetsReady(true);
      } catch (error) {
        console.error('Error loading assets:', error);
      }
    };

    loadAssets();
  }, []);

  if (!assetsReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <AppNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
