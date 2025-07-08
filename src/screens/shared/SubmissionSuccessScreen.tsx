import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { moderateScale, verticalScale, horizontalScale } from '../../utils/metrics';
import { colors } from '../../utils/colors';

interface RouteParams {
  message?: string;
  navigateBackTo?: string;
}

const SubmissionSuccessScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { message, navigateBackTo } = (route.params as RouteParams) || {};

  // Animations
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Start animations
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Auto-navigate after delay
    const timer = setTimeout(() => {
      handleGoBack();
    }, 3000);

    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleGoBack();
      return true;
    });

    return () => {
      clearTimeout(timer);
      backHandler.remove();
    };
  }, []);

  const handleGoBack = () => {
    if (navigateBackTo) {
      (navigation as any).navigate(navigateBackTo);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('Main');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.success, colors.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Success Icon */}
            <Animated.View 
              style={[
                styles.iconContainer,
                {
                  transform: [{ scale: scaleAnim }],
                }
              ]}
            >
              <View style={styles.iconWrapper}>
                <Ionicons 
                  name="checkmark-circle" 
                  size={moderateScale(80)} 
                  color={colors.success} 
                />
              </View>
            </Animated.View>

            {/* Success Message */}
            <Animated.View 
              style={[
                styles.messageContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <Text style={styles.successTitle}>Request Submitted!</Text>
              <Text style={styles.successMessage}>
                {message || 'Your request has been submitted successfully!'}
              </Text>
              <Text style={styles.followUpText}>
                Our team will contact you within 24 hours to discuss the next steps.
              </Text>
            </Animated.View>

            {/* Features List */}
            <Animated.View 
              style={[
                styles.featuresContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <FeatureItem 
                icon="time-outline"
                text="Quick Response within 24 hours"
              />
              <FeatureItem 
                icon="call-outline"
                text="Expert consultation included"
              />
              <FeatureItem 
                icon="shield-checkmark-outline"
                text="Quality service guaranteed"
              />
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View 
              style={[
                styles.buttonContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleGoBack}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="home-outline" size={moderateScale(20)} color={colors.textInverse} />
                  <Text style={styles.primaryButtonText}>Back to Home</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => (navigation as any).navigate('YourCropCalendar')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>View My Requests</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Auto-redirect Notice */}
            <Animated.View 
              style={[
                styles.autoRedirectContainer,
                {
                  opacity: fadeAnim,
                }
              ]}
            >
              <Text style={styles.autoRedirectText}>
                Automatically redirecting in 3 seconds...
              </Text>
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

interface FeatureItemProps {
  icon: string;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIconContainer}>
      <Ionicons name={icon as any} size={moderateScale(20)} color={colors.textInverse} />
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(32),
  },
  iconContainer: {
    marginBottom: verticalScale(32),
  },
  iconWrapper: {
    width: horizontalScale(120),
    height: horizontalScale(120),
    borderRadius: horizontalScale(60),
    backgroundColor: colors.textInverse,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowDark,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  successTitle: {
    fontSize: moderateScale(28),
    fontFamily: 'Poppins-Bold',
    color: colors.textInverse,
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },
  successMessage: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Medium',
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.95,
    marginBottom: verticalScale(16),
    lineHeight: moderateScale(24),
  },
  followUpText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: moderateScale(20),
  },
  featuresContainer: {
    width: '100%',
    marginBottom: verticalScale(40),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
  },
  featureIconContainer: {
    width: horizontalScale(32),
    height: horizontalScale(32),
    borderRadius: horizontalScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(16),
  },
  featureText: {
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.textInverse,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: verticalScale(24),
  },
  primaryButton: {
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowDark,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(24),
  },
  primaryButtonText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
    marginLeft: horizontalScale(8),
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.textInverse,
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(24),
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
  },
  autoRedirectContainer: {
    position: 'absolute',
    bottom: verticalScale(40),
    alignItems: 'center',
  },
  autoRedirectText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    opacity: 0.7,
  },
});

export default SubmissionSuccessScreen;