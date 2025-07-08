import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { horizontalScale, moderateScale, verticalScale } from '../../utils/metrics';
import { colors } from '../../utils/colors';

const ExpertVisitScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    farmLocation: '',
    soilType: '',
    cropType: '',
    areaInHectares: '',
    query: '',
  });

  const handleSubmit = () => {
    if (!formData.farmLocation || !formData.query) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    Alert.alert(
      'Success',
      'Your expert visit request has been submitted!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.secondary, colors.cropGreen]}
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
            <Text style={styles.headerTitle}>Expert Visit</Text>
            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Farm Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your farm location"
              placeholderTextColor={colors.textSecondary}
              value={formData.farmLocation}
              onChangeText={(text) => setFormData(prev => ({ ...prev, farmLocation: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Soil Type</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter soil type"
              placeholderTextColor={colors.textSecondary}
              value={formData.soilType}
              onChangeText={(text) => setFormData(prev => ({ ...prev, soilType: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Crop Type</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter crop type"
              placeholderTextColor={colors.textSecondary}
              value={formData.cropType}
              onChangeText={(text) => setFormData(prev => ({ ...prev, cropType: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area in Hectares</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter area in hectares"
              placeholderTextColor={colors.textSecondary}
              value={formData.areaInHectares}
              onChangeText={(text) => setFormData(prev => ({ ...prev, areaInHectares: text }))}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purpose of Visit *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the purpose of expert visit, specific problems, or consultation requirements..."
              placeholderTextColor={colors.textSecondary}
              value={formData.query}
              onChangeText={(text) => setFormData(prev => ({ ...prev, query: text }))}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>Submit Request</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  form: {
    padding: horizontalScale(20),
  },
  inputGroup: {
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
  textArea: {
    height: verticalScale(100),
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: verticalScale(32),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
  },
  submitText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
  },
});

export default ExpertVisitScreen;