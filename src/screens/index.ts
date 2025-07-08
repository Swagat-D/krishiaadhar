// src/screens/index.ts

// Auth Screens
export { default as WelcomeScreen } from './auth/WelcomeScreen';
export { default as AuthenticationScreen } from './auth/AuthenticationScreen';

// Main Screens
export { default as HomeScreen } from './main/HomeScreen';
export { default as Main } from './main/Main';
export { default as FeedScreen } from './main/FeedScreen';
export { default as ProfileScreen } from './main/ProfileScreen';

// Service Screens
export { default as SmartIrrigationScreen } from './services/SmartIrrigationScreen';
export { default as DroneSprayingScreen } from './services/DroneSprayingScreen';
export { default as SoilHealthMapScreen } from './services/SoilHealthMapScreen';
export { default as CropHealthScreen } from './services/CropHealthScreen';
export { default as ExpertVisitScreen } from './services/ExpertVisitScreen';

// Crop Management Screens
export { default as CropCalendarScreen } from './crop/CropCalendarScreen';
export { default as CropCalendarCreateScreen } from './crop/CropCalendarCreateScreen';
export { default as YourCropCalendarScreen } from './crop/YourCropCalendarScreen';
export { default as CalendarScreen } from './crop/CalendarScreen';

// Shared Screens
export { default as SplashScreen } from './shared/SplashScreen';
export { default as SubmissionSuccessScreen } from './shared/SubmissionSuccessScreen';
export { default as TermsPrivacyScreen } from './shared/TermsPrivacyScreen';