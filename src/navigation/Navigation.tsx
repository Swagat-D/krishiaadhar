// src/navigation/Navigation.tsx
import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../utils/colors';

// Import screens
import {
  // Auth screens
  SplashScreen,
  WelcomeScreen,
  AuthenticationScreen,
  
  // Main screens
  Main,
  
  // Service screens
  SmartIrrigationScreen,
  DroneSprayingScreen,
  SoilHealthMapScreen,
  CropHealthScreen,
  ExpertVisitScreen,
  
  // Crop management screens
  CropCalendarScreen,
  CropCalendarCreateScreen,
  YourCropCalendarScreen,
  CalendarScreen,
  
  // Shared screens
  SubmissionSuccessScreen,
  TermsPrivacyScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        
        <Stack.Screen
          name="Authentication"
          component={AuthenticationScreen}
        />

        {/* Main App Flow */}
        <Stack.Screen
          name="Main"
          component={Main}
          options={{
            gestureEnabled: false,
          }}
        />

        {/* Service Screens */}
        <Stack.Screen
          name="SmartIrrigation"
          component={SmartIrrigationScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        
        <Stack.Screen
          name="DroneSprayingService"
          component={DroneSprayingScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        
        <Stack.Screen
          name="SoilHealthMap"
          component={SoilHealthMapScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        
        <Stack.Screen
          name="CropHealthMonitor"
          component={CropHealthScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        
        <Stack.Screen
          name="ExpertVisit"
          component={ExpertVisitScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />

        {/* Crop Management Screens */}
        <Stack.Screen
          name="CropCalendar"
          component={CropCalendarScreen}
        />
        
        <Stack.Screen
          name="CreateCropCalendar"
          component={CropCalendarCreateScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        
        <Stack.Screen
          name="YourCropCalendar"
          component={YourCropCalendarScreen}
        />
        
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
        />

        {/* Shared Screens */}
        <Stack.Screen
          name="SubmissionSuccess"
          component={SubmissionSuccessScreen}
          options={{
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
        
        <Stack.Screen
          name="TermsAndService"
          component={TermsPrivacyScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;