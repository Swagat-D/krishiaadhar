// src/components/RegisterForm.tsx
import React, { useState, useEffect } from 'react';
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
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { horizontalScale, moderateScale, verticalScale, SPACING } from '../utils/metrics';
import { colors } from '../utils/colors';
import { BASE_URL, API_ENDPOINTS, USER_ROLES } from '../utils/constants';
import { useUserStore } from '../store/userStore';
import { RegisterFormData, UserRole } from '../types';

interface RegisterFormProps {
  setIsRegistering: (value: boolean) => void;
  role: UserRole;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ setIsRegistering, role }) => {
  const [focusedInput, setFocusedInput] = useState<string>('');
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    role,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const navigation = useNavigation();
  const setUserData = useUserStore(state => state.setUserData);

  const animatedValues = {
    name: new Animated.Value(0),
    phone: new Animated.Value(0),
    email: new Animated.Value(0),
    password: new Animated.Value(0),
  };

  useEffect(() => {
    if (showProfileModal) {
      fetchLocation();
    }
  }, [showProfileModal]);

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

  const updateFormData = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }

    if (role === USER_ROLES.FARMER) {
      if (!formData.phoneNumber?.trim()) {
        Alert.alert('Error', 'Please enter your phone number');
        return false;
      }
    } else {
      if (!formData.email?.trim()) {
        Alert.alert('Error', 'Please enter your email');
        return false;
      }
    }

    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const fetchLocation = async () => {
    try {
      setFetchingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocation('Location permission denied');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;

      // Reverse geocoding to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const locationString = `${address.city || address.subregion || address.region}, ${address.country}`;
        setLocation(locationString);
        await AsyncStorage.setItem('location', JSON.stringify(locationString));
      } else {
        setLocation('Location not available');
      }
    } catch (error) {
      console.log('Location error:', error);
      setLocation('Location not available');
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const url = role === USER_ROLES.FARMER 
        ? `${BASE_URL}${API_ENDPOINTS.FARMER_REGISTER}`
        : `${BASE_URL}${API_ENDPOINTS.EXPERT_REGISTER}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        setUserData(data.response);
        await AsyncStorage.setItem('userData', JSON.stringify(data.response));
        setShowProfileModal(true);
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Something went wrong, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSkip = () => {
    setShowProfileModal(false);
    navigation.navigate('Main' as never);
  };

  const handleComplete = () => {
    setShowProfileModal(false);
    navigation.navigate('Main' as never);
  };

  const getAnimatedBorderColor = (inputName: string) => {
    return animatedValues[inputName as keyof typeof animatedValues].interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border, colors.primary],
    });
  };

  return (
    <View style={styles.container}>
      {/* Name Input */}
      <Animated.View 
        style={[
          styles.inputContainer,
          { borderColor: getAnimatedBorderColor('name') }
        ]}
      >
        <Ionicons
          name="person-outline"
          size={moderateScale(20)}
          color={focusedInput === 'name' ? colors.primary : colors.textSecondary}
          style={styles.icon}
        />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor={colors.textSecondary}
          style={styles.textInput}
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
          onFocus={() => handleFocus('name')}
          onBlur={() => handleBlur('name')}
          returnKeyType="next"
          autoCapitalize="words"
        />
      </Animated.View>

      {/* Email Input (for experts only) */}
      {role !== USER_ROLES.FARMER && (
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
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            keyboardType="email-address"
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Animated.View>
      )}

      {/* Phone Input */}
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
          value={formData.phoneNumber}
          onChangeText={(text) => updateFormData('phoneNumber', text)}
          onFocus={() => handleFocus('phone')}
          onBlur={() => handleBlur('phone')}
          keyboardType="phone-pad"
          returnKeyType="next"
        />
      </Animated.View>

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
          value={formData.password}
          onChangeText={(text) => updateFormData('password', text)}
          onFocus={() => handleFocus('password')}
          onBlur={() => handleBlur('password')}
          secureTextEntry={!showPassword}
          returnKeyType="done"
          onSubmitEditing={handleRegister}
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

      {/* Register Button */}
      <TouchableOpacity
        style={[
          styles.registerButton,
          loading && styles.disabledButton
        ]}
        onPress={handleRegister}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={colors.textInverse} size="small" />
        ) : (
          <Text style={styles.registerButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      {/* Sign In Link */}
      <TouchableOpacity
        onPress={() => setIsRegistering(false)}
        style={styles.signInButton}
        activeOpacity={0.7}
      >
        <Text style={styles.signInText}>
          Already have an account? <Text style={styles.signInLink}>Sign In</Text>
        </Text>
      </TouchableOpacity>

      {/* Profile Completion Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Hi {formData.name}, let's complete your profile!
            </Text>

            <TouchableOpacity onPress={handleImageUpload} style={styles.imageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={moderateScale(40)} color={colors.primary} />
                  <Text style={styles.uploadText}>Upload Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={moderateScale(20)} color={colors.primary} />
              <Text style={styles.locationText}>
                {fetchingLocation ? 'Fetching location...' : location || 'Location not available'}
              </Text>
            </View>

            {location && !fetchingLocation && (
              <TouchableOpacity onPress={fetchLocation} style={styles.refetchButton}>
                <Text style={styles.refetchButtonText}>Re-fetch Location</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>Complete Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
    fontFamily: 'Poppins-Regular',
    paddingVertical: Platform.OS === 'ios' ? verticalScale(2) : 0,
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  registerButton: {
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
  registerButtonText: {
    fontSize: moderateScale(16),
    color: colors.textInverse,
    fontFamily: 'Poppins-SemiBold',
  },
  signInButton: {
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  signInText: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
    fontFamily: 'Poppins-Regular',
  },
  signInLink: {
    color: colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalContent: {
    padding: horizontalScale(24),
    alignItems: 'center',
    paddingTop: verticalScale(60),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: verticalScale(32),
  },
  imageContainer: {
    marginBottom: verticalScale(24),
  },
  profileImage: {
    width: horizontalScale(120),
    height: horizontalScale(120),
    borderRadius: horizontalScale(60),
  },
  imagePlaceholder: {
    width: horizontalScale(120),
    height: horizontalScale(120),
    borderRadius: horizontalScale(60),
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: verticalScale(8),
    color: colors.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: moderateScale(12),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
    width: '100%',
  },
  locationText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontFamily: 'Poppins-Regular',
    fontSize: moderateScale(14),
    color: colors.text,
  },
  refetchButton: {
    marginBottom: verticalScale(24),
  },
  refetchButtonText: {
    color: colors.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: moderateScale(14),
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(32),
    marginBottom: verticalScale(16),
  },
  completeButtonText: {
    color: colors.textInverse,
    fontFamily: 'Poppins-SemiBold',
    fontSize: moderateScale(16),
  },
  skipButton: {
    paddingVertical: verticalScale(12),
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontFamily: 'Poppins-Medium',
    fontSize: moderateScale(14),
  },
});

export default RegisterForm;