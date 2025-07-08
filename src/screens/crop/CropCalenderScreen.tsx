import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { horizontalScale, moderateScale, verticalScale } from '../../utils/metrics';
import { colors } from '../../utils/colors';

const CropCalendarScreen: React.FC = () => {
  const navigation = useNavigation();

  const calendarOptions = [
    {
      title: 'Create New Calendar',
      subtitle: 'Start a new crop planning calendar',
      icon: 'add-circle',
      color: colors.primary,
      onPress: () => (navigation as any).navigate('CreateCropCalendar'),
    },
    {
      title: 'Your Calendars',
      subtitle: 'View and manage existing calendars',
      icon: 'calendar',
      color: colors.secondary,
      onPress: () => (navigation as any).navigate('YourCropCalendar'),
    },
    {
      title: 'Request Calendar',
      subtitle: 'Get expert help with calendar planning',
      icon: 'people',
      color: colors.info,
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.info, colors.primary]}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={moderateScale(24)} color={colors.textInverse} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Crop Calendar</Text>
            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsContainer}>
          {calendarOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionCard}
              onPress={option.onPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[option.color, `${option.color}80`]}
                style={styles.optionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionIcon}>
                    <Ionicons name={option.icon as any} size={moderateScale(32)} color={colors.textInverse} />
                  </View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingBottom: verticalScale(20),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(10),
  },
  backButton: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: horizontalScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
    textAlign: 'center',
  },
  headerRight: {
    width: horizontalScale(40),
  },
  content: {
    flex: 1,
    marginTop: verticalScale(-10),
  },
  optionsContainer: {
    padding: horizontalScale(20),
  },
  optionCard: {
    marginBottom: verticalScale(16),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionGradient: {
    padding: horizontalScale(20),
  },
  optionContent: {
    alignItems: 'center',
  },
  optionIcon: {
    marginBottom: verticalScale(12),
  },
  optionTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  optionSubtitle: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default CropCalendarScreen;