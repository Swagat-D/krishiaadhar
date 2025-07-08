// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Navigation from './src/navigation/Navigation';
import { colors } from './src/utils/colors';
import { moderateScale } from './src/utils/metrics';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
          'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
          'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
          'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
          'Poppins-Black': require('./assets/fonts/Poppins-Black.ttf'),
          'Poppins-Thin': require('./assets/fonts/Poppins-Thin.ttf'),
          'Poppins-ExtraLight': require('./assets/fonts/Poppins-ExtraLight.ttf'),
          'Poppins-Italic': require('./assets/fonts/Poppins-Italic.ttf'),
          'Poppins-LightItalic': require('./assets/fonts/Poppins-LightItalic.ttf'),
          'Poppins-MediumItalic': require('./assets/fonts/Poppins-MediumItalic.ttf'),
          'Poppins-SemiBoldItalic': require('./assets/fonts/Poppins-SemiBoldItalic.ttf'),
          'Poppins-BoldItalic': require('./assets/fonts/Poppins-BoldItalic.ttf'),
          'Poppins-ExtraBoldItalic': require('./assets/fonts/Poppins-ExtraBoldItalic.ttf'),
          'Poppins-BlackItalic': require('./assets/fonts/Poppins-BlackItalic.ttf'),
          'Poppins-ThinItalic': require('./assets/fonts/Poppins-ThinItalic.ttf'),
          'Poppins-ExtraLightItalic': require('./assets/fonts/Poppins-ExtraLightItalic.ttf'),
        });

        // Simulate loading time (can be removed in production)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      // Hide the splash screen once the app is ready
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // Show loading screen while fonts are loading
    return (
      <View style={{
        flex: 1,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color={colors.textInverse} />
        <Text style={{
          color: colors.textInverse,
          fontSize: moderateScale(16),
          fontWeight: '500',
          marginTop: 20,
        }}>
          Loading KrishiAadhar...
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <StatusBar style="auto" />
          <Navigation />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}