// src/screens/services/SmartIrrigationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import { horizontalScale, moderateScale, verticalScale, SPACING } from '../../utils/metrics';
import { colors } from '../../utils/colors';
import { BASE_URL, API_ENDPOINTS, IRRIGATION_TYPE_OPTIONS, CROP_TYPE_OPTIONS } from '../../utils/constants';
import { useUserStore } from '../../store/userStore';
import { SmartIrrigationRequest } from '../../types';

const SmartIrrigationScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userData } = useUserStore();

  // Form state
  const [formData, setFormData] = useState({
  farmLocation: '',
  irrigationType: '' as 'DRIP' | 'SPRINKLER' | 'SURFACE' | 'SUBSURFACE',
  areaInHectares: 0,
  cropType: '' as 'Cereal' | 'Vegetable' | 'Fruit' | 'Pulses' | 'Oilseeds',
  query: '',
});

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string>('');

  // Animation
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
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

  const updateFormData = (field: keyof SmartIrrigationRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.farmLocation.trim()) {
      newErrors.farmLocation = 'Farm location is required';
    }

    if (!formData.irrigationType) {
      newErrors.irrigationType = 'Please select an irrigation type';
    }

    if (!formData.areaInHectares || formData.areaInHectares <= 0) {
      newErrors.areaInHectares = 'Please enter a valid area';
    }

    if (!formData.cropType) {
      newErrors.cropType = 'Please select a crop type';
    }

    if (!formData.query.trim()) {
      newErrors.query = 'Please describe your requirements';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      const cleanedToken = userData?.token?.replace(/"/g, '');
      
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.SMART_IRRIGATION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': cleanedToken || '',
        },
        body: JSON.stringify({
          ...formData,
          areaInHectares: parseFloat(formData.areaInHectares.toString()),
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        (navigation as any).navigate('SubmissionSuccess', {
          message: 'Your smart irrigation request has been submitted successfully!',
          navigateBackTo: 'Main',
        });
      } else {
        throw new Error(responseData.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[colors.skyBlue, colors.primary]}
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
          <Text style={styles.headerTitle}>Smart Irrigation</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderInputField = (
    field: keyof SmartIrrigationRequest,
    label: string,
    placeholder: string,
    options?: {
      keyboardType?: 'default' | 'numeric' | 'email-address';
      multiline?: boolean;
      numberOfLines?: number;
    }
  ) => (
    <Animated.View 
      style={[
        styles.inputContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === field && styles.focusedInput,
          errors[field] ? styles.errorInput : undefined,
          options?.multiline && styles.multilineInput,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={formData[field]?.toString()}
        onChangeText={(text) => updateFormData(field, options?.keyboardType === 'numeric' ? parseFloat(text) || 0 : text)}
        onFocus={() => setFocusedField(field)}
        onBlur={() => setFocusedField('')}
        keyboardType={options?.keyboardType || 'default'}
        multiline={options?.multiline}
        numberOfLines={options?.numberOfLines}
        returnKeyType={options?.multiline ? 'default' : 'next'}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </Animated.View>
  );

  const renderPickerField = (
    field: keyof SmartIrrigationRequest,
    label: string,
    options: readonly string[],
    placeholder: string
  ) => (
    <Animated.View 
      style={[
        styles.inputContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.pickerContainer,
        errors[field] ? styles.errorInput : undefined,
      ]}>
        <Picker
          selectedValue={formData[field]}
          onValueChange={(value) => updateFormData(field, value)}
          style={styles.picker}
        >
          <Picker.Item label={placeholder} value="" enabled={false} />
          {options.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      </View>
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Service Info */}
          <Animated.View 
            style={[
              styles.infoCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <LinearGradient
              colors={[colors.skyBlue, colors.info]}
              style={styles.infoGradient}
            >
              <Ionicons name="water" size={moderateScale(32)} color={colors.textInverse} />
              <Text style={styles.infoTitle}>Smart Irrigation Setup</Text>
              <Text style={styles.infoDescription}>
                Get professional irrigation system installation with IoT sensors for optimal water management
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Form Fields */}
          {renderInputField('farmLocation', 'Farm Location', 'Enter your farm location')}
          
          {renderPickerField(
            'irrigationType', 
            'Irrigation Type', 
            IRRIGATION_TYPE_OPTIONS, 
            'Select irrigation type'
          )}
          
          {renderInputField(
            'areaInHectares', 
            'Area (Hectares)', 
            'Enter area in hectares',
            { keyboardType: 'numeric' }
          )}
          
          {renderPickerField(
            'cropType', 
            'Crop Type', 
            CROP_TYPE_OPTIONS, 
            'Select crop type'
          )}
          
          {renderInputField(
            'query', 
            'Requirements & Specifications', 
            'Describe your irrigation requirements, soil type, current setup, and any specific needs...',
            { multiline: true, numberOfLines: 4 }
          )}

          {/* Submit Button */}
          <Animated.View 
            style={[
              styles.submitContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.submitGradient}
              >
                {loading ? (
                  <ActivityIndicator color={colors.textInverse} size="small" />
                ) : (
                  <>
                    <Ionicons name="send" size={moderateScale(20)} color={colors.textInverse} />
                    <Text style={styles.submitText}>Submit Request</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
  },
  infoCard: {
    marginBottom: verticalScale(24),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  infoGradient: {
    padding: horizontalScale(20),
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
  },
  infoDescription: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: moderateScale(18),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.text,
    marginBottom: verticalScale(8),
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
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
  focusedInput: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  errorInput: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  multilineInput: {
    height: verticalScale(100),
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
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
  picker: {
    height: verticalScale(50),
    color: colors.text,
  },
  errorText: {
    fontSize: moderateScale(11),
    fontFamily: 'Poppins-Regular',
    color: colors.error,
    marginTop: verticalScale(4),
    marginLeft: horizontalScale(4),
  },
  submitContainer: {
    marginTop: verticalScale(32),
  },
  submitButton: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(24),
  },
  submitText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
    marginLeft: horizontalScale(8),
  },
  bottomSpacing: {
    height: verticalScale(40),
  },
});

export default SmartIrrigationScreen;