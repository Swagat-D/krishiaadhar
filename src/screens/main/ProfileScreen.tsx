// src/screens/main/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';

import { horizontalScale, moderateScale, verticalScale, SPACING } from '../../utils/metrics';
import { colors } from '../../utils/colors';
import { useUserStore } from '../../store/userStore';
import { USER_ROLES } from '../../utils/constants';

interface ProfileItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  color?: string;
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userData, resetUserData } = useUserStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Clear user data
      resetUserData();
      await AsyncStorage.multiRemove(['userData', 'location']);

      // Navigate to welcome screen
      (navigation as any).dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        })
      );
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing feature will be available soon!');
  };

  const handleSettings = () => {
    Alert.alert('Coming Soon', 'Settings feature will be available soon!');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'For support, please contact us at support@krishiaadhar.com');
  };

  const getUserDisplayImage = () => {
    if (userData?.profilePic) {
      return { uri: userData.profilePic };
    }
    
    // Default images based on role
    return userData?.role === USER_ROLES.FARMER
      ? require('../../../assets/images/farmer.png')
      : { uri: 'https://www.shutterstock.com/image-photo/portrait-middle-aged-rancher-standing-260nw-1491637241.jpg' };
  };

  const stats = [
    {
      title: 'Projects',
      value: '5',
      icon: 'briefcase',
      color: colors.primary,
    },
    {
      title: 'Expert Visits',
      value: '3',
      icon: 'people',
      color: colors.secondary,
    },
    {
      title: 'Reports',
      value: '12',
      icon: 'document-text',
      color: colors.info,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={getUserDisplayImage()}
                  style={styles.profileImage}
                />
                <TouchableOpacity 
                  style={styles.editImageButton}
                  onPress={handleEditProfile}
                >
                  <Ionicons name="camera" size={moderateScale(16)} color={colors.textInverse} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.userName}>{userData?.name || 'User'}</Text>
              <Text style={styles.userRole}>
                {userData?.role === USER_ROLES.FARMER ? 'Farmer' : 'Agricultural Expert'}
              </Text>
              {userData?.phoneNumber && (
                <Text style={styles.userContact}>{userData.phoneNumber}</Text>
              )}
              {userData?.email && (
                <Text style={styles.userContact}>{userData.email}</Text>
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </Animated.View>

        {/* Menu Items */}
        <Animated.View 
          style={[
            styles.menuContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Account</Text>
          
          <ProfileItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={handleEditProfile}
          />
          
          <ProfileItem
            icon="settings-outline"
            title="Settings"
            subtitle="App preferences and configurations"
            onPress={handleSettings}
          />
          
          <ProfileItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your notifications"
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon!')}
          />
          
          <ProfileItem
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            subtitle="Manage your privacy settings"
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon!')}
          />
        </Animated.View>

        <Animated.View 
          style={[
            styles.menuContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Support</Text>
          
          <ProfileItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={handleHelp}
          />
          
          <ProfileItem
            icon="information-circle-outline"
            title="About"
            subtitle="App version and information"
            onPress={() => Alert.alert('KrishiAadhar', 'Version 2.0.0\n\nSmart farming solutions for modern agriculture.')}
          />
          
          <ProfileItem
            icon="star-outline"
            title="Rate App"
            subtitle="Rate us on the app store"
            onPress={() => Alert.alert('Thank You!', 'Feature will redirect to app store soon!')}
          />
        </Animated.View>

        {/* Logout Button */}
        <Animated.View 
          style={[
            styles.logoutContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoggingOut}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.error, '#DC2626']}
              style={styles.logoutGradient}
            >
              <Ionicons 
                name="log-out-outline" 
                size={moderateScale(20)} 
                color={colors.textInverse} 
              />
              <Text style={styles.logoutText}>
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileItem: React.FC<ProfileItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showArrow = true,
  color = colors.textSecondary 
}) => (
  <TouchableOpacity 
    style={styles.profileItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.profileItemLeft}>
      <View style={[styles.profileItemIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={moderateScale(20)} color={color} />
      </View>
      <View style={styles.profileItemText}>
        <Text style={styles.profileItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.profileItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {showArrow && (
      <Ionicons 
        name="chevron-forward" 
        size={moderateScale(20)} 
        color={colors.textSecondary} 
      />
    )}
  </TouchableOpacity>
);

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => (
  <View style={styles.statsCard}>
    <LinearGradient
      colors={[color, `${color}80`]}
      style={styles.statsIconContainer}
    >
      <Ionicons name={icon as any} size={moderateScale(24)} color={colors.textInverse} />
    </LinearGradient>
    <Text style={styles.statsValue}>{value}</Text>
    <Text style={styles.statsTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    marginBottom: verticalScale(20),
  },
  headerGradient: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
    borderBottomLeftRadius: moderateScale(32),
    borderBottomRightRadius: moderateScale(32),
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: horizontalScale(24),
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: verticalScale(16),
  },
  profileImage: {
    width: horizontalScale(100),
    height: horizontalScale(100),
    borderRadius: horizontalScale(50),
    borderWidth: 4,
    borderColor: colors.textInverse,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: horizontalScale(16),
    width: horizontalScale(32),
    height: horizontalScale(32),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.textInverse,
  },
  userName: {
    fontSize: moderateScale(24),
    fontFamily: 'Poppins-Bold',
    color: colors.textInverse,
    marginBottom: verticalScale(4),
  },
  userRole: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.textInverse,
    opacity: 0.9,
    marginBottom: verticalScale(8),
  },
  userContact: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textInverse,
    opacity: 0.8,
    marginBottom: verticalScale(2),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(-20),
    marginBottom: verticalScale(32),
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(16),
    padding: horizontalScale(16),
    alignItems: 'center',
    flex: 1,
    marginHorizontal: horizontalScale(4),
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
  statsIconContainer: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: horizontalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  statsValue: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-Bold',
    color: colors.text,
    marginBottom: verticalScale(4),
  },
  statsTitle: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(8),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginHorizontal: horizontalScale(20),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemIcon: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: horizontalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(16),
  },
  profileItemText: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.text,
    marginBottom: verticalScale(2),
  },
  profileItemSubtitle: {
    fontSize: moderateScale(11),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: moderateScale(14),
  },
  logoutContainer: {
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
  },
  logoutButton: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.error,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(24),
  },
  logoutText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.textInverse,
    marginLeft: horizontalScale(8),
  },
  bottomSpacing: {
    height: verticalScale(40),
  },
});

export default ProfileScreen;