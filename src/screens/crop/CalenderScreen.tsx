import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

import { horizontalScale, moderateScale, verticalScale, SPACING } from '../../utils/metrics';
import { colors } from '../../utils/colors';
import { BASE_URL, API_ENDPOINTS } from '../../utils/constants';
import { useUserStore } from '../../store/userStore';
import { CropCalendar } from '../../types';

interface RouteParams {
  id: string;
}

interface CalendarTask {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'sowing' | 'fertilizer' | 'pesticide' | 'irrigation' | 'harvest';
  status: 'pending' | 'completed' | 'overdue';
}

const CalendarScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = (route.params as RouteParams) || {};
  const { userData } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [cropCalendar, setCropCalendar] = useState<CropCalendar | null>(null);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

  // Animation
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
    if (id) {
      fetchCalendarData();
    }
    
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
  }, [id]);

  useEffect(() => {
    generateMarkedDates();
  }, [tasks, selectedDate]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const cleanedToken = userData?.token?.replace(/"/g, '');
      
      // In a real app, you'd fetch the specific calendar by ID
      // For now, we'll simulate the data
      const mockCalendar: CropCalendar = {
        id: id,
        projectName: 'Rice Cultivation Project',
        projectDescription: 'Organic rice cultivation using sustainable farming practices',
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
      };

      // Mock tasks for the calendar
      const mockTasks: CalendarTask[] = [
        {
          id: '1',
          title: 'Land Preparation',
          description: 'Plough the field and prepare seedbeds',
          date: '2024-06-10',
          type: 'sowing',
          status: 'completed'
        },
        {
          id: '2',
          title: 'Seed Sowing',
          description: 'Sow IR64 rice seeds in prepared nursery',
          date: '2024-06-15',
          type: 'sowing',
          status: 'completed'
        },
        {
          id: '3',
          title: 'First Fertilizer Application',
          description: 'Apply NPK fertilizer (120:60:40 kg/ha)',
          date: '2024-07-01',
          type: 'fertilizer',
          status: 'pending'
        },
        {
          id: '4',
          title: 'Transplanting',
          description: 'Transplant 25-day old seedlings',
          date: '2024-07-10',
          type: 'sowing',
          status: 'pending'
        },
        {
          id: '5',
          title: 'Pest Control',
          description: 'Apply pesticide for stem borer control',
          date: '2024-07-25',
          type: 'pesticide',
          status: 'pending'
        },
        {
          id: '6',
          title: 'Irrigation Schedule',
          description: 'Maintain 2-3 cm water level',
          date: '2024-08-01',
          type: 'irrigation',
          status: 'pending'
        },
        {
          id: '7',
          title: 'Second Fertilizer',
          description: 'Apply urea for panicle development',
          date: '2024-08-15',
          type: 'fertilizer',
          status: 'pending'
        },
        {
          id: '8',
          title: 'Harvest',
          description: 'Harvest mature rice crop',
          date: '2024-10-15',
          type: 'harvest',
          status: 'pending'
        }
      ];

      setCropCalendar(mockCalendar);
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      Alert.alert('Error', 'Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const generateMarkedDates = () => {
    const marked: Record<string, any> = {};
    
    // Mark task dates
    tasks.forEach(task => {
      const taskColor = getTaskColor(task.type);
      marked[task.date] = {
        marked: true,
        dotColor: taskColor,
        selectedColor: task.status === 'completed' ? colors.success : taskColor,
      };
    });

    // Mark selected date
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: colors.primary,
    };

    setMarkedDates(marked);
  };

  const getTaskColor = (type: CalendarTask['type']): string => {
    switch (type) {
      case 'sowing': return colors.cropGreen;
      case 'fertilizer': return colors.warning;
      case 'pesticide': return colors.error;
      case 'irrigation': return colors.skyBlue;
      case 'harvest': return colors.secondary;
      default: return colors.primary;
    }
  };

  const getTaskIcon = (type: CalendarTask['type']): string => {
    switch (type) {
      case 'sowing': return 'leaf-outline';
      case 'fertilizer': return 'nutrition-outline';
      case 'pesticide': return 'bug-outline';
      case 'irrigation': return 'water-outline';
      case 'harvest': return 'basket-outline';
      default: return 'calendar-outline';
    }
  };

  const getTasksForDate = (date: string): CalendarTask[] => {
    return tasks.filter(task => task.date === date);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
          : task
      )
    );
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[colors.info, colors.primary]}
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
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Crop Calendar</Text>
            <Text style={styles.headerSubtitle}>
              {cropCalendar?.cropName} - {cropCalendar?.season} Season
            </Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={moderateScale(20)} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderCalendarInfo = () => (
    <Animated.View 
      style={[
        styles.infoCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={moderateScale(16)} color={colors.primary} />
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{cropCalendar?.location}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="resize-outline" size={moderateScale(16)} color={colors.secondary} />
          <Text style={styles.infoLabel}>Area</Text>
          <Text style={styles.infoValue}>{cropCalendar?.fieldSize} Ha</Text>
        </View>
      </View>
      
      {cropCalendar?.expert && (
        <View style={styles.expertInfo}>
          <Ionicons name="person-circle-outline" size={moderateScale(20)} color={colors.info} />
          <View style={styles.expertText}>
            <Text style={styles.expertLabel}>Assigned Expert</Text>
            <Text style={styles.expertName}>{cropCalendar.expert.name}</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );

  const renderTaskItem = (task: CalendarTask) => (
    <TouchableOpacity 
      key={task.id}
      style={[
        styles.taskItem,
        task.status === 'completed' && styles.completedTask
      ]}
      onPress={() => toggleTaskStatus(task.id)}
      activeOpacity={0.7}
    >
      <View style={styles.taskLeft}>
        <LinearGradient
          colors={[getTaskColor(task.type), `${getTaskColor(task.type)}80`]}
          style={styles.taskIcon}
        >
          <Ionicons 
            name={getTaskIcon(task.type) as any} 
            size={moderateScale(16)} 
            color={colors.textInverse} 
          />
        </LinearGradient>
        <View style={styles.taskContent}>
          <Text style={[
            styles.taskTitle,
            task.status === 'completed' && styles.completedText
          ]}>
            {task.title}
          </Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
          <Text style={styles.taskDate}>
            {moment(task.date).format('MMM DD, YYYY')}
          </Text>
        </View>
      </View>
      <View style={styles.taskRight}>
        <Ionicons 
          name={task.status === 'completed' ? 'checkmark-circle' : 'ellipse-outline'} 
          size={moderateScale(24)} 
          color={task.status === 'completed' ? colors.success : colors.border} 
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading calendar...</Text>
      </View>
    );
  }

  if (!cropCalendar) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={moderateScale(64)} color={colors.error} />
        <Text style={styles.errorText}>Calendar not found</Text>
        <TouchableOpacity 
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCalendarInfo()}

        {/* Calendar Component */}
        <Animated.View 
          style={[
            styles.calendarContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: colors.surface,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.textInverse,
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.textTertiary,
              dotColor: colors.primary,
              selectedDotColor: colors.textInverse,
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              indicatorColor: colors.primary,
              textDayFontFamily: 'Poppins-Regular',
              textMonthFontFamily: 'Poppins-SemiBold',
              textDayHeaderFontFamily: 'Poppins-Medium',
            }}
          />
        </Animated.View>

        {/* Tasks for Selected Date */}
        <Animated.View 
          style={[
            styles.tasksContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.tasksTitle}>
            Tasks for {moment(selectedDate).format('MMMM DD, YYYY')}
          </Text>
          
          {selectedDateTasks.length > 0 ? (
            selectedDateTasks.map(renderTaskItem)
          ) : (
            <View style={styles.noTasksContainer}>
              <Ionicons name="calendar-outline" size={moderateScale(48)} color={colors.textSecondary} />
              <Text style={styles.noTasksText}>No tasks scheduled for this date</Text>
            </View>
          )}
        </Animated.View>

        {/* All Upcoming Tasks */}
        <Animated.View 
          style={[
            styles.allTasksContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.tasksTitle}>All Upcoming Tasks</Text>
          
          {tasks
            .filter(task => moment(task.date).isAfter(moment(), 'day') || task.date === selectedDate)
            .slice(0, 5)
            .map(renderTaskItem)
          }
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: horizontalScale(32),
  },
  errorText: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(24),
  },
  errorButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
  },
  errorButtonText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
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
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
  },
  headerSubtitle: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    opacity: 0.8,
    marginTop: verticalScale(2),
  },
  menuButton: {
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
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: horizontalScale(20),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(16),
    borderRadius: moderateScale(16),
    padding: horizontalScale(20),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
    marginTop: verticalScale(4),
    marginBottom: verticalScale(2),
  },
  infoValue: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  expertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: moderateScale(12),
    padding: horizontalScale(12),
  },
  expertText: {
    marginLeft: horizontalScale(12),
    flex: 1,
  },
  expertLabel: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  expertName: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginTop: verticalScale(2),
  },
  calendarContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
    borderRadius: moderateScale(16),
    padding: horizontalScale(16),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tasksContainer: {
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(24),
  },
  allTasksContainer: {
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(24),
  },
  tasksTitle: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: verticalScale(16),
  },
  taskItem: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(12),
    padding: horizontalScale(16),
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  completedTask: {
    backgroundColor: colors.backgroundSecondary,
    opacity: 0.8,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIcon: {
    width: horizontalScale(32),
    height: horizontalScale(32),
    borderRadius: horizontalScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(12),
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: verticalScale(2),
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  taskDescription: {
    fontSize: moderateScale(11),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: moderateScale(16),
    marginBottom: verticalScale(4),
  },
  taskDate: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Medium',
    color: colors.info,
  },
  taskRight: {
    marginLeft: horizontalScale(12),
  },
  noTasksContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(40),
  },
  noTasksText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginTop: verticalScale(12),
  },
  bottomSpacing: {
    height: verticalScale(40),
  },
});

export default CalendarScreen;