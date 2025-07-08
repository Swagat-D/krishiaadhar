// src/components/CropDetails.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { horizontalScale, moderateScale, verticalScale, SPACING } from '../utils/metrics';
import { colors } from '../utils/colors';
import { CropCalendar } from '../types';

// Define navigation types
type RootStackParamList = {
  Calendar: { id: string | number };
  // Add other screens here as needed
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface CropDetailCardProps {
  crop: CropCalendar;
  onPress?: () => void;
}

const CropDetailCard: React.FC<CropDetailCardProps> = ({ crop, onPress }) => {
  const navigation = useNavigation<NavigationProp>();

  const {
    cropName,
    cropType,
    expert,
    fieldSize,
    location,
    season,
    startDate,
    status,
    projectName,
  } = crop;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to calendar screen with proper typing
      navigation.navigate('Calendar', { id: crop.id });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return colors.success;
      case 'PENDING':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'checkmark-circle';
      case 'PENDING':
        return 'time';
      default:
        return 'help-circle';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.projectTitle} numberOfLines={1}>
            {projectName || cropName}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
            <Ionicons
              name={getStatusIcon(status)}
              size={moderateScale(12)}
              color={colors.textInverse}
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </View>

      {/* Content Grid */}
      <View style={styles.contentGrid}>
        {/* Row 1 */}
        <View style={styles.row}>
          <View style={styles.item}>
            <Ionicons name="leaf" size={moderateScale(16)} color={colors.cropGreen} />
            <Text style={styles.label}>Crop</Text>
            <Text style={styles.value} numberOfLines={1}>{cropName}</Text>
          </View>
          <View style={styles.item}>
            <Ionicons name="grid" size={moderateScale(16)} color={colors.soilBrown} />
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value} numberOfLines={1}>{cropType}</Text>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <View style={styles.item}>
            <Ionicons name="resize" size={moderateScale(16)} color={colors.primary} />
            <Text style={styles.label}>Area</Text>
            <Text style={styles.value}>{fieldSize} acres</Text>
          </View>
          <View style={styles.item}>
            <Ionicons name="sunny" size={moderateScale(16)} color={colors.sunYellow} />
            <Text style={styles.label}>Season</Text>
            <Text style={styles.value} numberOfLines={1}>{season}</Text>
          </View>
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <View style={styles.item}>
            <Ionicons name="location" size={moderateScale(16)} color={colors.error} />
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value} numberOfLines={1}>{location}</Text>
          </View>
          <View style={styles.item}>
            <Ionicons name="calendar" size={moderateScale(16)} color={colors.info} />
            <Text style={styles.label}>Start Date</Text>
            <Text style={styles.value}>
              {moment(startDate).format('MMM DD, YYYY')}
            </Text>
          </View>
        </View>

        {/* Expert Info */}
        {expert && (
          <View style={styles.expertContainer}>
            <Ionicons name="person-circle" size={moderateScale(16)} color={colors.secondary} />
            <Text style={styles.label}>Expert Assigned</Text>
            <Text style={styles.expertName}>{expert.name}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Created {moment(startDate).fromNow()}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={moderateScale(16)}
          color={colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(16),
    padding: horizontalScale(16),
    marginVertical: verticalScale(8),
    marginHorizontal: horizontalScale(4),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    marginBottom: verticalScale(16),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectTitle: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginRight: horizontalScale(12),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
  },
  statusIcon: {
    marginRight: horizontalScale(4),
  },
  statusText: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Medium',
    color: colors.textInverse,
  },
  contentGrid: {
    marginBottom: verticalScale(16),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(8),
  },
  label: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
    marginLeft: horizontalScale(6),
    marginRight: horizontalScale(4),
    minWidth: horizontalScale(35),
  },
  value: {
    flex: 1,
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
  },
  expertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: moderateScale(8),
    padding: horizontalScale(12),
    marginTop: verticalScale(8),
  },
  expertName: {
    flex: 1,
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-SemiBold',
    color: colors.secondary,
    marginLeft: horizontalScale(4),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  footerText: {
    fontSize: moderateScale(11),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
});

export default CropDetailCard;