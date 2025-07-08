// src/components/LoginForm.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { horizontalScale, moderateScale, verticalScale, SPACING } from '../utils/metrics';
import { colors } from '../utils/colors';
import { BASE_URL, API_ENDPOINTS, USER_ROLES } from '../utils/constants';
import { useUserStore } from '../store/userStore';
import { LoginFormData, UserRole } from '../types';

interface LoginFormProps {
  setIsRegistering: (value: boolean) => void;
  role: UserRole;
}

const LoginForm: React.FC<LoginFormProps> = ({ setIsRegistering, role }) => {
  const [focusedInput, setFocusedInput] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const setUserData = useUserStore(state => state.setUserData);

  const animatedValues = {
    phone: new Animated.Value(0),
    email: new Animated.Value(0),
    password: new Animated.Value(0),
  };

  const handleFocus = (inputName: string) => {
    setFocusedInput(inputName);
    Animated.timing(animatedValues[inputName as keyof typeof animatedValues], {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (inputName: string) => {
    setFocusedInput('');
    Animated.timing(animatedValues[inputName as keyof typeof animatedValues], {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const validateForm = (): boolean => {
    if (role === USER_ROLES.FARMER) {
      if (!phoneNumber.trim()) {
        Alert.alert('Error', 'Please enter your phone number');
        return false;
      }
    } else {
      if (!email.trim()) {
        Alert.alert('Error', 'Please enter your email');
        return false;
      }
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const url = role === USER_ROLES.FARMER 
        ? `${BASE_URL}${API_ENDPOINTS.FARMER_LOGIN}`
        : `${BASE_URL}${API_ENDPOINTS.EXPERT_LOGIN}`;

      const requestBody: LoginFormData = {
        password,
        ...(role === USER_ROLES.FARMER 
          ? { phoneNumber } 
          : { email }
        ),
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        setUserData(data.response);
        await AsyncStorage.setItem('userData', JSON.stringify(data.response));
        
        Alert.alert('Success', 'Login successful', [
          { text: 'OK', onPress: () => navigation.navigate('Main' as never) }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong, please try again');
    } finally {
      setLoading(false);
    }
  };

  const getAnimatedBorderColor = (inputName: string) => {
    return animatedValues[inputName as keyof typeof animatedValues].interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border, colors.primary],
    });
  };

  return (
    <View style={styles.container}>
      {/* Phone/Email Input */}
      {role === USER_ROLES.FARMER ? (
        <Animated.View 
          style={[
            styles.inputContainer,
            { borderColor: getAnimatedBorderColor('phone') }
          ]}
        >
          <Ionicons
            name="call-outline"
            size={moderateScale(20)}
            color={focusedInput === 'phone' ? colors.primary : colors.textSecondary}
            style={styles.icon}
          />
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor={colors.textSecondary}
            style={styles.textInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onFocus={() => handleFocus('phone')}
            onBlur={() => handleBlur('phone')}
            keyboardType="phone-pad"
            returnKeyType="next"
            autoCapitalize="none"
          />
        </Animated.View>
      ) : (
        <Animated.View 
          style={[
            styles.inputContainer,
            { borderColor: getAnimatedBorderColor('email') }
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={moderateScale(20)}
            color={focusedInput === 'email' ? colors.primary : colors.textSecondary}
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            keyboardType="email-address"
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Animated.View>
      )}

      {/* Password Input */}
      <Animated.View 
        style={[
          styles.inputContainer,
          { borderColor: getAnimatedBorderColor('password') }
        ]}
      >
        <Ionicons
          name="lock-closed-outline"
          size={moderateScale(20)}
          color={focusedInput === 'password' ? colors.primary : colors.textSecondary}
          style={styles.icon}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          style={styles.textInput}
          value={password}
          onChangeText={setPassword}
          onFocus={() => handleFocus('password')}
          onBlur={() => handleBlur('password')}
          secureTextEntry={!showPassword}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={moderateScale(20)}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Login Button */}
      <TouchableOpacity
        style={[
          styles.loginButton,
          loading && styles.disabledButton
        ]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={colors.textInverse} size="small" />
        ) : (
          <Text style={styles.loginButtonText}>Continue</Text>
        )}
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity
        onPress={() => setIsRegistering(true)}
        style={styles.signUpButton}
        activeOpacity={0.7}
      >
        <Text style={styles.signUpText}>
          Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: horizontalScale(20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(16),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  icon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    fontSize: moderateScale(14),
    color: colors.text,
    fontWeight: '400',
    paddingVertical: Platform.OS === 'ios' ? verticalScale(2) : 0,
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(24),
    marginBottom: verticalScale(16),
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: colors.textInverse,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  signUpText: {
    color: colors.textSecondary,
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  signUpButton: {
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
    signUpLink: {
      color: colors.primary,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
  });

  export default LoginForm;