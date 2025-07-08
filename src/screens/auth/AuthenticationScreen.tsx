// src/screens/auth/AuthenticationScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';

import { horizontalScale, moderateScale, verticalScale, SCREEN_HEIGHT } from '../../utils/metrics';
import { colors } from '../../utils/colors';
import { APP_CONFIG, USER_ROLES } from '../../utils/constants';
import { UserRole } from '../../types';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';

interface RouteParams {
  role: UserRole;
}

const AuthenticationScreen: React.FC = () => {
  const route = useRoute();
  const { role } = route.params as RouteParams;
  const [isRegistering, setIsRegistering] = useState(false);

  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const openTerms = () => {
    Linking.openURL(APP_CONFIG.termsUrl);
  };

  const openPrivacy = () => {
    Linking.openURL(APP_CONFIG.privacyUrl);
  };

  const getRoleDisplayName = (role: UserRole) => {
    return role === USER_ROLES.FARMER ? 'Farmer' : 'Agricultural Expert';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header Background */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
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
                <Text style={styles.appTitle}>KrishiAadhar</Text>
                <Text style={styles.welcomeText}>
                  {isRegistering ? 'Create Account' : 'Welcome Back'}
                </Text>
                <Text style={styles.subtitle}>
                  {isRegistering 
                    ? `Join as ${getRoleDisplayName(role)} and start your journey`
                    : `Sign in as ${getRoleDisplayName(role)} to continue`
                  }
                </Text>
              </Animated.View>

              {/* Form Section */}
              <Animated.View 
                style={[
                  styles.formSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  }
                ]}
              >
                <View style={styles.formContainer}>
                  {isRegistering ? (
                    <RegisterForm 
                      setIsRegistering={setIsRegistering} 
                      role={role}
                    />
                  ) : (
                    <LoginForm 
                      setIsRegistering={setIsRegistering} 
                      role={role}
                    />
                  )}
                </View>
              </Animated.View>

              {/* Terms and Privacy */}
              <Animated.View 
                style={[
                  styles.termsSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  }
                ]}
              >
                <Text style={styles.termsText}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.linkText} onPress={openTerms}>
                    Terms of Service
                  </Text>
                  {' '}and{' '}
                  <Text style={styles.linkText} onPress={openPrivacy}>
                    Privacy Policy
                  </Text>
                </Text>
              </Animated.View>

              {/* Role Badge */}
              <View style={styles.roleBadge}>
                <LinearGradient
                  colors={role === USER_ROLES.FARMER 
                    ? [colors.cropGreen, colors.secondary] 
                    : [colors.info, colors.primary]
                  }
                  style={styles.roleBadgeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.roleBadgeText}>
                    {getRoleDisplayName(role)}
                  </Text>
                </LinearGradient>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.4,
    borderBottomLeftRadius: moderateScale(32),
    borderBottomRightRadius: moderateScale(32),
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(40),
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(60),
    paddingHorizontal: horizontalScale(24),
  },
  appTitle: {
    fontSize: moderateScale(32),
    fontFamily: 'Poppins-Bold',
    color: colors.textInverse,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: moderateScale(24),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: moderateScale(20),
  },
  formSection: {
    flex: 1,
    marginTop: verticalScale(-30),
  },
  formContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: horizontalScale(20),
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(32),
    paddingHorizontal: horizontalScale(8),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowDark,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  termsSection: {
    paddingHorizontal: horizontalScale(32),
    paddingTop: verticalScale(24),
    alignItems: 'center',
  },
  termsText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateScale(18),
  },
  linkText: {
    color: colors.primary,
    fontFamily: 'Poppins-Medium',
    textDecorationLine: 'underline',
  },
  roleBadge: {
    position: 'absolute',
    top: verticalScale(100),
    right: horizontalScale(24),
    borderRadius: moderateScale(20),
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
  roleBadgeGradient: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
  },
  roleBadgeText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
  },
});

export default AuthenticationScreen;