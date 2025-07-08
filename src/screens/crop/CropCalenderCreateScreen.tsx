// src/screens/crop/CropCalendarCreateScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/colors';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/metrics';

const CropCalendarCreateScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Crop Calendar</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>Crop Calendar Creation feature coming soon!</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => Alert.alert('Coming Soon', 'This feature will be available in the next update')}
        >
          <Text style={styles.buttonText}>Get Notified</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// src/screens/crop/YourCropCalendarScreen.tsx
export const YourCropCalendarScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Your Crop Calendars</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>No crop calendars found. Create your first one!</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => (navigation as any).navigate('CreateCropCalendar')}
        >
          <Text style={styles.buttonText}>Create Calendar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// src/screens/crop/CalendarScreen.tsx
export const CalendarScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Calendar Details</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>Calendar details view coming soon!</Text>
      </View>
    </SafeAreaView>
  );
};

// src/screens/shared/TermsPrivacyScreen.tsx
export const TermsPrivacyScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Terms & Privacy</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>Terms and Privacy Policy content will be displayed here.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    flex: 1,
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    textAlign: 'center',
    marginRight: horizontalScale(24),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
  },
  message: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: verticalScale(32),
    lineHeight: moderateScale(24),
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: horizontalScale(32),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
  },
  buttonText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
  },
});

export default CropCalendarCreateScreen;