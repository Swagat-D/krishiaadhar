import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../utils/colors';
import { horizontalScale, moderateScale, verticalScale, LAYOUT } from '../../utils/metrics';
import { useUserStore } from '../../store/userStore';

import HomeScreen from './HomeScreen';
import FeedScreen from './FeedScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const Main: React.FC = () => {
  const { userData } = useUserStore();

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.appName}>KrishiAadhar</Text>
            <Text style={styles.userGreeting}>
              Welcome back, {userData?.name?.split(' ')[0] || 'User'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.notificationBadge}>
              <Ionicons 
                name="notifications-outline" 
                size={moderateScale(24)} 
                color={colors.textInverse} 
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Navigator */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Feed') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 0,
            height: LAYOUT.tabBarHeight,
            paddingBottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(8),
            paddingTop: verticalScale(8),
            elevation: 8,
            shadowColor: colors.shadow,
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: moderateScale(11),
            fontFamily: 'Poppins-Medium',
            marginTop: verticalScale(4),
          },
          tabBarItemStyle: {
            paddingVertical: verticalScale(4),
          },
          tabBarBackground: () => (
            <View style={styles.tabBarBackground}>
              <LinearGradient
                colors={[colors.surface, colors.backgroundSecondary]}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
            </View>
          ),
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarBadge: undefined,
          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarLabel: 'Community',
            tabBarBadge: undefined,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarBadge: undefined,
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: LAYOUT.headerHeight,
    paddingBottom: verticalScale(16),
    paddingHorizontal: horizontalScale(20),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowDark,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  appName: {
    fontSize: moderateScale(24),
    fontFamily: 'Poppins-Bold',
    color: colors.textInverse,
    marginBottom: verticalScale(2),
  },
  userGreeting: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    opacity: 0.9,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'relative',
    padding: horizontalScale(8),
  },
  badge: {
    position: 'absolute',
    top: horizontalScale(4),
    right: horizontalScale(4),
    backgroundColor: colors.error,
    borderRadius: horizontalScale(8),
    minWidth: horizontalScale(16),
    height: horizontalScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.textInverse,
  },
  badgeText: {
    fontSize: moderateScale(9),
    fontFamily: 'Poppins-Bold',
    color: colors.textInverse,
  },
  tabBarBackground: {
    flex: 1,
  },
});

export default Main;