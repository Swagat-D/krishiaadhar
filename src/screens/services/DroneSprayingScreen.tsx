// src/screens/services/DroneSprayingScreen.tsx
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
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

import { horizontalScale, moderateScale, verticalScale } from '../../utils/metrics';
import { colors } from '../../utils/colors';
import { BASE_URL, API_ENDPOINTS, CROP_TYPE_OPTIONS } from '../../utils/constants';
import { useUserStore } from '../../store/userStore';
import { DroneSprayingRequest } from '../../types';

const DroneSprayingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userData } = useUserStore();

  type CropType = 'Cereal' | 'Vegetable' | 'Fruit' | 'Pulses' | 'Oilseeds';

  interface DroneSprayingRequest {
  farmLocation: string;
  cropType: CropType | ''; // Allow empty string for form input
  areaInHectares: number;
  sprayDate: string;
  query: string;
}

  // Form state
  const [formData, setFormData] = useState<DroneSprayingRequest>({
    farmLocation: '',
    cropType: '',
    areaInHectares: 0,
    sprayDate: '',
    query: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string>('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

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

  const updateFormData = (field: keyof DroneSprayingRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.farmLocation.trim()) {
      newErrors.farmLocation = 'Farm location is required';
    }

    if (!formData.cropType) {
      newErrors.cropType = 'Please select a crop type';
    }

    if (!formData.areaInHectares || formData.areaInHectares <= 0) {
      newErrors.areaInHectares = 'Please enter a valid area';
    }

    if (!formData.sprayDate) {
      newErrors.sprayDate = 'Please select a spray date';
    }

    if (!formData.query.trim()) {
      newErrors.query = 'Please describe your spraying requirements';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    updateFormData('sprayDate', formattedDate);
    setDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      const cleanedToken = userData?.token?.replace(/"/g, '');
      
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.DRONE_SPRAYING}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': cleanedToken || '',
        },
        body: JSON.stringify({
          ...formData,
          areaInHectares: parseFloat(formData.areaInHectares.toString()),
          sprayDate: new Date(formData.sprayDate).toISOString(),
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        (navigation as any).navigate('SubmissionSuccess', {
          message: 'Your drone spraying request has been submitted successfully!',
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
      colors={[colors.warning, '#FF6B35']}
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
          <Text style={styles.headerTitle}>Drone Spraying Service</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              colors={[colors.warning, '#FF8C42']}
              style={styles.infoGradient}
            >
              <Ionicons name="airplane" size={moderateScale(32)} color={colors.textInverse} />
              <Text style={styles.infoTitle}>Precision Drone Spraying</Text>
              <Text style={styles.infoDescription}>
                Advanced drone technology for precise pesticide and fertilizer application
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View 
            style={[
              styles.inputContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.label}>Farm Location</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'farmLocation' && styles.focusedInput,
                errors.farmLocation ? styles.errorInput : undefined,
              ]}
              placeholder="Enter your farm location"
              placeholderTextColor={colors.textSecondary}
              value={formData.farmLocation}
              onChangeText={(text) => updateFormData('farmLocation', text)}
              onFocus={() => setFocusedField('farmLocation')}
              onBlur={() => setFocusedField('')}
            />
            {errors.farmLocation && (
              <Text style={styles.errorText}>{errors.farmLocation}</Text>
            )}
          </Animated.View>

          <Animated.View 
            style={[
              styles.inputContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.label}>Crop Type</Text>
            <View style={[
              styles.pickerContainer,
              errors.cropType ? styles.errorInput : undefined,
            ]}>
              <Picker
                selectedValue={formData.cropType}
                onValueChange={(value) => updateFormData('cropType', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select crop type" value="" enabled={false} />
                {CROP_TYPE_OPTIONS.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker>
            </View>
            {errors.cropType && (
              <Text style={styles.errorText}>{errors.cropType}</Text>
            )}
          </Animated.View>

          <Animated.View 
            style={[
              styles.inputContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.label}>Area (Hectares)</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'areaInHectares' && styles.focusedInput,
                errors.areaInHectares ? styles.errorInput : undefined,
              ]}
              placeholder="Enter area in hectares"
              placeholderTextColor={colors.textSecondary}
              value={formData.areaInHectares.toString()}
              onChangeText={(text) => updateFormData('areaInHectares', parseFloat(text) || 0)}
              onFocus={() => setFocusedField('areaInHectares')}
              onBlur={() => setFocusedField('')}
              keyboardType="numeric"
            />
            {errors.areaInHectares && (
              <Text style={styles.errorText}>{errors.areaInHectares}</Text>
            )}
          </Animated.View>

          <Animated.View 
            style={[
              styles.inputContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.label}>Preferred Spray Date</Text>
            <TouchableOpacity
              style={[
                styles.dateInput,
                errors.sprayDate ? styles.errorInput : undefined,
              ]}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={[
                styles.dateText,
                !formData.sprayDate && styles.placeholderText
              ]}>
                {formData.sprayDate 
                  ? new Date(formData.sprayDate).toLocaleDateString()
                  : 'Select spray date'
                }
              </Text>
              <Ionicons name="calendar-outline" size={moderateScale(20)} color={colors.primary} />
            </TouchableOpacity>
            {errors.sprayDate && (
              <Text style={styles.errorText}>{errors.sprayDate}</Text>
            )}
          </Animated.View>

          <Animated.View 
            style={[
              styles.inputContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.label}>Spraying Requirements</Text>
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                focusedField === 'query' && styles.focusedInput,
                errors.query ? styles.errorInput : undefined,
              ]}
              placeholder="Describe your spraying requirements, type of chemicals, pest issues, and any specific instructions..."
              placeholderTextColor={colors.textSecondary}
              value={formData.query}
              onChangeText={(text) => updateFormData('query', text)}
              onFocus={() => setFocusedField('query')}
              onBlur={() => setFocusedField('')}
              multiline
              numberOfLines={4}
            />
            {errors.query && (
              <Text style={styles.errorText}>{errors.query}</Text>
            )}
          </Animated.View>

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

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
        minimumDate={new Date()}
      />
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
  dateInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  dateText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
  },
  placeholderText: {
    color: colors.textSecondary,
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

export default DroneSprayingScreen;