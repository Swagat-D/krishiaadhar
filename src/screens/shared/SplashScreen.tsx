// src/screens/shared/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { horizontalScale, moderateScale, verticalScale } from '../../utils/metrics';
import { colors } from '../../utils/colors';
import { useUserStore } from '../../store/userStore';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const { loadUserData, userData } = useUserStore();

  // Animation values
  const logoScale = new Animated.Value(0.3);
  const logoOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);
  const textSlide = new Animated.Value(30);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Start animations
    startAnimations();

    try {
      // Load user data from storage
      await loadUserData();
    } catch (error) {
      console.error('Error loading user data:', error);
    }

    // Wait for animations to complete, then navigate
    setTimeout(() => {
      navigateToNextScreen();
    }, 3000);
  };

  const startAnimations = () => {
    // Logo animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      // Text animation
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const navigateToNextScreen = () => {
    if (userData?.token) {
      navigation.navigate('Main' as never);
    } else {
      navigation.navigate('Welcome' as never);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              }
            ]}
          >
            <View style={styles.logoWrapper}>
              <Image
                source={require('../../../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* Text Section */}
          <Animated.View 
            style={[
              styles.textContainer,
              {
                opacity: textOpacity,
                transform: [{ translateY: textSlide }],
              }
            ]}
          >
            <Text style={styles.appName}>KrishiAadhar</Text>
            <Text style={styles.tagline}>Smart Farming Solutions</Text>
            
            {/* Loading indicator */}
            <View style={styles.loadingContainer}>
              <View style={styles.loadingDots}>
                <LoadingDot delay={0} />
                <LoadingDot delay={200} />
                <LoadingDot delay={400} />
              </View>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          </Animated.View>

          {/* Version */}
          <Animated.View 
            style={[
              styles.versionContainer,
              { opacity: textOpacity }
            ]}
          >
            <Text style={styles.versionText}>Version 2.0.0</Text>
            <Text style={styles.copyrightText}>© 2024 KrishiAadhar</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
};

// Loading dot component with animation
const LoadingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const dotOpacity = new Animated.Value(0.3);

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    const timer = setTimeout(animate, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View 
      style={[
        styles.dot,
        { opacity: dotOpacity }
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  logoWrapper: {
    width: horizontalScale(140),
    height: horizontalScale(140),
    borderRadius: horizontalScale(70),
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    width: horizontalScale(100),
    height: horizontalScale(100),
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(60),
  },
  appName: {
    fontSize: moderateScale(36),
    fontFamily: 'Poppins-Bold',
    color: colors.textInverse,
    textAlign: 'center',
    marginBottom: verticalScale(8),
    letterSpacing: 2,
  },
  tagline: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Medium',
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: verticalScale(32),
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginBottom: verticalScale(12),
  },
  dot: {
    width: horizontalScale(8),
    height: horizontalScale(8),
    borderRadius: horizontalScale(4),
    backgroundColor: colors.textInverse,
    marginHorizontal: horizontalScale(4),
  },
  loadingText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    opacity: 0.8,
  },
  versionContainer: {
    position: 'absolute',
    bottom: verticalScale(60),
    alignItems: 'center',
  },
  versionText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.textInverse,
    opacity: 0.7,
    marginBottom: verticalScale(4),
  },
  copyrightText: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    opacity: 0.6,
  },
});

export default SplashScreen;