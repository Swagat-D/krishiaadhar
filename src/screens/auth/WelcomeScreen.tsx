import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { moderateScale, verticalScale, horizontalScale, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/metrics';
import { colors } from '../../utils/colors';
import { USER_ROLES } from '../../utils/constants';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const navigateToAuth = (role: string) => {
    (navigation as any).navigate('Authentication', { role });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ImageBackground
        source={require('../../../assets/images/welcome.webp')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.3)',
            'rgba(0,0,0,0.5)', 
            'rgba(0,0,0,0.7)',
            'rgba(0,0,0,0.9)',
          ]}
          style={styles.gradient}
          locations={[0, 0.3, 0.6, 1]}
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Header Section */}
            <Animated.View 
              style={[
                styles.headerSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <Text style={styles.appName}>KrishiAadhar</Text>
              <Text style={styles.tagline}>Smart Farming Solutions</Text>
              <Text style={styles.description}>
                Empowering farmers with technology for better crop management and sustainable agriculture
              </Text>
            </Animated.View>

            {/* Feature Highlights */}
            <Animated.View 
              style={[
                styles.featuresSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <View style={styles.featureRow}>
                <FeatureItem icon="🌱" text="Smart Irrigation" />
                <FeatureItem icon="📊" text="Soil Health Analysis" />
              </View>
              <View style={styles.featureRow}>
                <FeatureItem icon="🚁" text="Drone Spraying" />
                <FeatureItem icon="👨‍🌾" text="Expert Consultation" />
              </View>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View 
              style={[
                styles.buttonSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => navigateToAuth(USER_ROLES.FARMER)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryButtonText}>Continue as Farmer</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => navigateToAuth(USER_ROLES.EXPERT)}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Continue as Expert</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
              <Text style={styles.versionText}>Version 2.0.0</Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

interface FeatureItemProps {
  icon: string;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  backgroundImage: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(24),
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: verticalScale(60),
  },
  appName: {
    fontSize: moderateScale(36),
    fontFamily: 'Poppins-Bold',
    color: colors.textInverse,
    textAlign: 'center',
    marginBottom: verticalScale(8),
    letterSpacing: 1,
  },
  tagline: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-Medium',
    color: colors.textInverse,
    textAlign: 'center',
    marginBottom: verticalScale(16),
    opacity: 0.9,
  },
  description: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    textAlign: 'center',
    lineHeight: moderateScale(22),
    opacity: 0.8,
    paddingHorizontal: horizontalScale(16),
  },
  featuresSection: {
    marginVertical: verticalScale(40),
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: verticalScale(20),
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: moderateScale(32),
    marginBottom: verticalScale(8),
  },
  featureText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonSection: {
    marginBottom: verticalScale(40),
  },
  button: {
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(16),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  primaryButton: {
    height: verticalScale(56),
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
  },
  primaryButtonText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
  },
  secondaryButton: {
    height: verticalScale(56),
    borderWidth: 2,
    borderColor: colors.textInverse,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
  },
  bottomSection: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  versionText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    opacity: 0.6,
  },
});

export default WelcomeScreen;