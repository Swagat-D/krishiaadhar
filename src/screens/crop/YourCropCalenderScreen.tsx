import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

import { horizontalScale, moderateScale, verticalScale, SPACING } from '../../utils/metrics';
import { colors } from '../../utils/colors';
import { BASE_URL, API_ENDPOINTS } from '../../utils/constants';
import { useUserStore } from '../../store/userStore';
import { CropCalendar } from '../../types';
import CropDetailCard from '../../components/CropDetails';

const YourCropCalendarScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userData } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [calendars, setCalendars] = useState<CropCalendar[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Animation
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useFocusEffect(
    React.useCallback(() => {
      fetchCalendars();
    }, [])
  );

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

  const fetchCalendars = async () => {
    try {
      setLoading(true);
      const cleanedToken = userData?.token?.replace(/"/g, '');
      
      // For demo purposes, using mock data
      // In real app, you'd fetch from: `${BASE_URL}${API_ENDPOINTS.CROP_CALENDAR_ALL}`
      
      const mockCalendars: CropCalendar[] = [
        {
          id: '1',
          projectName: 'Organic Rice Cultivation',
          projectDescription: 'Sustainable rice farming using organic methods',
          cropName: 'Rice',
          cropType: 'Cereal',
          fieldSize: 5.5,
          location: 'Bhubaneswar, Odisha',
          season: 'Kharif',
          startDate: '2024-06-15',
          seedVariety: 'IR64',
          cropVariety: 'Medium grain',
          status: 'PENDING',
          expert: {
            id: '1',
            name: 'Dr. Rajesh Kumar'
          }
        },
        {
          id: '2',
          projectName: 'Wheat Winter Crop',
          projectDescription: 'High-yield wheat cultivation for winter season',
          cropName: 'Wheat',
          cropType: 'Cereal',
          fieldSize: 3.2,
          location: 'Cuttack, Odisha',
          season: 'Rabi',
          startDate: '2024-11-01',
          seedVariety: 'HD2967',
          cropVariety: 'Durum wheat',
          status: 'PENDING',
          expert: {
            id: '2',
            name: 'Dr. Priya Sharma'
          }
        },
        {
          id: '3',
          projectName: 'Tomato Greenhouse',
          projectDescription: 'Protected cultivation of cherry tomatoes',
          cropName: 'Tomato',
          cropType: 'Vegetable',
          fieldSize: 0.8,
          location: 'Puri, Odisha',
          season: 'Zaid',
          startDate: '2024-03-01',
          seedVariety: 'Cherry Belle',
          cropVariety: 'Hybrid',
          status: 'COMPLETED',
          expert: {
            id: '3',
            name: 'Dr. Amit Patel'
          }
        },
        {
          id: '4',
          projectName: 'Sugarcane Plantation',
          projectDescription: 'Large scale sugarcane cultivation',
          cropName: 'Sugarcane',
          cropType: 'Cereal',
          fieldSize: 12.0,
          location: 'Balasore, Odisha',
          season: 'Kharif',
          startDate: '2024-05-01',
          seedVariety: 'Co 86032',
          cropVariety: 'High sucrose',
          status: 'PENDING'
        },
        {
          id: '5',
          projectName: 'Mango Orchard Care',
          projectDescription: 'Seasonal care and maintenance of mango trees',
          cropName: 'Mango',
          cropType: 'Fruit',
          fieldSize: 2.5,
          location: 'Khordha, Odisha',
          season: 'Kharif',
          startDate: '2024-04-15',
          seedVariety: 'Alphonso',
          cropVariety: 'Premium variety',
          status: 'COMPLETED',
          expert: {
            id: '1',
            name: 'Dr. Rajesh Kumar'
          }
        }
      ];

      setCalendars(mockCalendars);
    } catch (error) {
      console.error('Error fetching calendars:', error);
      Alert.alert('Error', 'Failed to load your crop calendars');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCalendars();
    setRefreshing(false);
  };

  const handleCreateNew = () => {
    (navigation as any).navigate('CreateCropCalendar');
  };

  const handleCalendarPress = (calendar: CropCalendar) => {
    (navigation as any).navigate('Calendar', { id: calendar.id });
  };

  const handleDeleteCalendar = (calendarId: string) => {
    Alert.alert(
      'Delete Calendar',
      'Are you sure you want to delete this crop calendar? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCalendars(prev => prev.filter(cal => cal.id !== calendarId));
            Alert.alert('Success', 'Calendar deleted successfully');
          }
        }
      ]
    );
  };

  const getFilteredCalendars = (): CropCalendar[] => {
    switch (selectedFilter) {
      case 'active':
        return calendars.filter(cal => cal.status === 'PENDING');
      case 'completed':
        return calendars.filter(cal => cal.status === 'COMPLETED');
      default:
        return calendars;
    }
  };

  const getStatsData = () => {
    const total = calendars.length;
    const active = calendars.filter(cal => cal.status === 'PENDING').length;
    const completed = calendars.filter(cal => cal.status === 'COMPLETED').length;
    const totalArea = calendars.reduce((sum, cal) => sum + cal.fieldSize, 0);

    return { total, active, completed, totalArea };
  };

  const renderHeader = () => (
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
          <Text style={styles.headerTitle}>Your Crop Calendars</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleCreateNew}
          >
            <Ionicons name="add" size={moderateScale(24)} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderStats = () => {
    const stats = getStatsData();
    
    return (
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Projects</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.active}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalArea.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Total Area (Ha)</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderFilterTabs = () => (
    <Animated.View 
      style={[
        styles.filterContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      {(['all', 'active', 'completed'] as const).map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterTab,
            selectedFilter === filter && styles.activeFilterTab
          ]}
          onPress={() => setSelectedFilter(filter)}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.filterTabText,
            selectedFilter === filter && styles.activeFilterTabText
          ]}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View 
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <LinearGradient
        colors={[colors.backgroundSecondary, colors.surface]}
        style={styles.emptyCard}
      >
        <Ionicons name="calendar-outline" size={moderateScale(64)} color={colors.textSecondary} />
        <Text style={styles.emptyTitle}>No Crop Calendars Yet</Text>
        <Text style={styles.emptySubtitle}>
          Create your first crop calendar to start planning your farming activities
        </Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateNew}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.createButtonGradient}
          >
            <Ionicons name="add" size={moderateScale(20)} color={colors.textInverse} />
            <Text style={styles.createButtonText}>Create Calendar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const renderCalendarItem = (calendar: CropCalendar, index: number) => (
    <Animated.View
      key={calendar.id}
      style={[
        styles.calendarItemContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <CropDetailCard
        crop={calendar}
        onPress={() => handleCalendarPress(calendar)}
      />
      
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleCalendarPress(calendar)}
        >
          <Ionicons name="eye-outline" size={moderateScale(16)} color={colors.info} />
          <Text style={[styles.actionButtonText, { color: colors.info }]}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => Alert.alert('Coming Soon', 'Edit functionality will be available soon')}
        >
          <Ionicons name="create-outline" size={moderateScale(16)} color={colors.warning} />
          <Text style={[styles.actionButtonText, { color: colors.warning }]}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteCalendar(calendar.id)}
        >
          <Ionicons name="trash-outline" size={moderateScale(16)} color={colors.error} />
          <Text style={[styles.actionButtonText, { color: colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your calendars...</Text>
      </View>
    );
  }

  const filteredCalendars = getFilteredCalendars();

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {calendars.length > 0 && renderStats()}
        {calendars.length > 0 && renderFilterTabs()}

        {filteredCalendars.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.calendarsContainer}>
            {filteredCalendars.map((calendar, index) => 
              renderCalendarItem(calendar, index)
            )}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      {calendars.length > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={handleCreateNew}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={moderateScale(24)} color={colors.textInverse} />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
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
  addButton: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: horizontalScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: verticalScale(-10),
  },
  statsContainer: {
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(12),
    padding: horizontalScale(12),
    alignItems: 'center',
    flex: 1,
    marginHorizontal: horizontalScale(4),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statNumber: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: moderateScale(9),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
  },
  filterTab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    borderRadius: moderateScale(12),
    backgroundColor: colors.surface,
    marginHorizontal: horizontalScale(4),
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
  activeFilterTab: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
  },
  activeFilterTabText: {
    color: colors.textInverse,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(32),
    paddingTop: verticalScale(60),
  },
  emptyCard: {
    borderRadius: moderateScale(20),
    padding: horizontalScale(32),
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginTop: verticalScale(20),
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(32),
  },
  createButton: {
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
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(24),
  },
  createButtonText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
    marginLeft: horizontalScale(8),
  },
  calendarsContainer: {
    paddingHorizontal: horizontalScale(16),
  },
  calendarItemContainer: {
    marginBottom: verticalScale(8),
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    marginHorizontal: horizontalScale(4),
    marginTop: verticalScale(-8),
    borderBottomLeftRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    borderRadius: moderateScale(8),
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: horizontalScale(4),
  },
  viewButton: {
    backgroundColor: `${colors.info}15`,
  },
  editButton: {
    backgroundColor: `${colors.warning}15`,
  },
  deleteButton: {
    backgroundColor: `${colors.error}15`,
  },
  actionButtonText: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Medium',
    marginLeft: horizontalScale(4),
  },
  fab: {
    position: 'absolute',
    bottom: verticalScale(30),
    right: horizontalScale(20),
    borderRadius: moderateScale(28),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabGradient: {
    width: horizontalScale(56),
    height: horizontalScale(56),
    borderRadius: horizontalScale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: verticalScale(100),
  },
});

export default YourCropCalendarScreen;