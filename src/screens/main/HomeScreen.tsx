import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Platform,
  Animated,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../utils/colors';
import { horizontalScale, moderateScale, verticalScale, SPACING, isTablet } from '../../utils/metrics';
import SearchBox from '../../components/SearchBox';
import { useUserStore } from '../../store/userStore';
import type { ColorValue } from 'react-native';

interface ServiceCardProps {
  title: string;
  subtitle: string;
  imageSource: any;
  onPress: () => void;
  gradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
  icon: string;
}

interface QuickStatProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userData } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const services = [
    {
      title: 'Smart Irrigation',
      subtitle: 'Automated water management',
      imageSource: require('../../../assets/images/smartirigation.webp'),
      onPress: () => (navigation as any).navigate('SmartIrrigation'),
      gradient: [colors.skyBlue, colors.primary] as const,
      icon: 'water',
    },
    {
      title: 'Digital Soil Health',
      subtitle: 'Analyze soil composition',
      imageSource: require('../../../assets/images/digitalsoil.webp'),
      onPress: () => (navigation as any).navigate('SoilHealthMap'),
      gradient: [colors.soilBrown, '#8B4513'] as const,
      icon: 'analytics',
    },
    {
      title: 'Crop Health Monitor',
      subtitle: 'Real-time crop monitoring',
      imageSource: require('../../../assets/images/crophelth.webp'),
      onPress: () => (navigation as any).navigate('CropHealthMonitor'),
      gradient: [colors.cropGreen, colors.secondary] as const,
      icon: 'leaf',
    },
    {
      title: 'Drone Spraying',
      subtitle: 'Precision aerial treatment',
      imageSource: require('../../../assets/images/dronespraying.webp'),
      onPress: () => (navigation as any).navigate('DroneSprayingService'),
      gradient: [colors.warning, '#FF6B35'] as const,
      icon: 'airplane',
    },
    {
      title: 'Crop Calendar',
      subtitle: 'Plan your farming cycle',
      imageSource: require('../../../assets/images/cropcalender.webp'),
      onPress: () => (navigation as any).navigate('CropCalendar'),
      gradient: [colors.info, colors.primary] as const,
      icon: 'calendar',
    },
    {
      title: 'Expert Consultation',
      subtitle: 'Get professional advice',
      imageSource: require('../../../assets/images/expertvisit.webp'),
      onPress: () => (navigation as any).navigate('ExpertVisit'),
      gradient: [colors.secondary, colors.cropGreen] as const,
      icon: 'people',
    },
  ];

  const quickStats = [
    { title: 'Active Projects', value: '3', icon: 'trending-up', color: colors.success },
    { title: 'Expert Visits', value: '2', icon: 'people', color: colors.info },
    { title: 'This Season', value: 'Kharif', icon: 'sunny', color: colors.warning },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Box */}
        <SearchBox onSearchChange={(text) => console.log('Search:', text)} />

        {/* Hero Banner */}
        <Animated.View 
          style={[
            styles.bannerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <ImageBackground
            source={require('../../../assets/images/bg.jpg')}
            style={styles.bannerBackground}
            imageStyle={styles.bannerImage}
          >
            <LinearGradient
              colors={['rgba(31, 65, 187, 0.8)', 'rgba(31, 65, 187, 0.6)']}
              style={styles.bannerGradient}
            >
              <View style={styles.bannerContent}>
                <Text style={styles.bannerGreeting}>
                  Hello, {userData?.name || 'Farmer'}! 👋
                </Text>
                <Text style={styles.bannerTitle}>
                  Ready to optimize your farming today?
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Explore our smart farming solutions and boost your productivity
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Overview</Text>
          <View style={styles.statsRow}>
            {quickStats.map((stat, index) => (
              <QuickStat key={index} {...stat} />
            ))}
          </View>
        </Animated.View>

        {/* Services Grid */}
        <Animated.View 
          style={[
            styles.servicesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </View>
        </Animated.View>

        {/* Weather Card */}
        <Animated.View 
          style={[
            styles.weatherContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <LinearGradient
            colors={[colors.skyBlue, colors.info]}
            style={styles.weatherCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.weatherContent}>
              <View style={styles.weatherInfo}>
                <Text style={styles.weatherLocation}>Bhubaneswar, Odisha</Text>
                <Text style={styles.weatherTemp}>28°C</Text>
                <Text style={styles.weatherDesc}>Partly Cloudy</Text>
              </View>
              <Ionicons name="partly-sunny" size={moderateScale(60)} color={colors.textInverse} />
            </View>
            <Text style={styles.weatherAdvice}>
              Good conditions for outdoor farming activities
            </Text>
          </LinearGradient>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  subtitle, 
  imageSource, 
  onPress, 
  gradient,
  icon 
}) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.serviceCard, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.serviceImageContainer}>
          <Image source={imageSource} style={styles.serviceImage} />
          <LinearGradient
            colors={gradient}
            style={styles.serviceOverlay}
          >
            <Ionicons name={icon as any} size={moderateScale(24)} color={colors.textInverse} />
          </LinearGradient>
        </View>
        <View style={styles.serviceContent}>
          <Text style={styles.serviceTitle} numberOfLines={2}>{title}</Text>
          <Text style={styles.serviceSubtitle} numberOfLines={2}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const QuickStat: React.FC<QuickStatProps> = ({ title, value, icon, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIcon, { backgroundColor: color }]}>
      <Ionicons name={icon as any} size={moderateScale(20)} color={colors.textInverse} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    marginHorizontal: horizontalScale(16),
    marginBottom: verticalScale(20),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  bannerBackground: {
    height: verticalScale(160),
  },
  bannerImage: {
    borderRadius: moderateScale(16),
  },
  bannerGradient: {
    flex: 1,
    justifyContent: 'center',
    padding: horizontalScale(20),
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerGreeting: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.textInverse,
    marginBottom: verticalScale(4),
  },
  bannerTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-Bold',
    color: colors.textInverse,
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(24),
  },
  bannerSubtitle: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    opacity: 0.9,
    lineHeight: moderateScale(16),
  },
  statsContainer: {
    marginHorizontal: horizontalScale(16),
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: verticalScale(16),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: moderateScale(12),
    padding: horizontalScale(16),
    alignItems: 'center',
    marginHorizontal: horizontalScale(4),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statIcon: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: horizontalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  statValue: {
    fontSize: moderateScale(20),
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: verticalScale(4),
  },
  statTitle: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  servicesContainer: {
    marginHorizontal: horizontalScale(16),
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
    marginRight: horizontalScale(4),
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: isTablet ? '30%' : '48%',
    backgroundColor: colors.surface,
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(16),
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
  serviceImageContainer: {
    position: 'relative',
    height: verticalScale(100),
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  serviceOverlay: {
    position: 'absolute',
    top: horizontalScale(8),
    right: horizontalScale(8),
    width: horizontalScale(32),
    height: horizontalScale(32),
    borderRadius: horizontalScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceContent: {
    padding: horizontalScale(12),
  },
  serviceTitle: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: verticalScale(4),
    lineHeight: moderateScale(18),
  },
  serviceSubtitle: {
    fontSize: moderateScale(11),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: moderateScale(14),
  },
  weatherContainer: {
    marginHorizontal: horizontalScale(16),
    marginBottom: verticalScale(20),
  },
  weatherCard: {
    borderRadius: moderateScale(16),
    padding: horizontalScale(20),
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  weatherInfo: {
    flex: 1,
  },
  weatherLocation: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.textInverse,
    marginBottom: verticalScale(4),
  },
  weatherTemp: {
    fontSize: moderateScale(32),
    fontFamily: 'Poppins-Bold',
    color: colors.textInverse,
    marginBottom: verticalScale(4),
  },
  weatherDesc: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    opacity: 0.9,
  },
  weatherAdvice: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  bottomSpacing: {
    height: verticalScale(20),
  },
});

export default HomeScreen;