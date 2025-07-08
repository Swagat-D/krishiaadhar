// src/screens/shared/TermsPrivacyScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Animated,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { horizontalScale, moderateScale, verticalScale, SPACING } from '../../utils/metrics';
import { colors } from '../../utils/colors';
import { APP_CONFIG } from '../../utils/constants';

interface RouteParams {
  path?: 'terms' | 'privacy';
}

const TermsPrivacyScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { path } = (route.params as RouteParams) || { path: 'terms' };

  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'terms' | 'privacy'>(path || 'terms');

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

  const handleOpenWebVersion = async () => {
    const url = selectedTab === 'terms' ? APP_CONFIG.termsUrl : APP_CONFIG.privacyUrl;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[colors.primary, colors.info]}
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
          <Text style={styles.headerTitle}>
            {selectedTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
          </Text>
          <TouchableOpacity 
            style={styles.webButton}
            onPress={handleOpenWebVersion}
          >
            <Ionicons name="open-outline" size={moderateScale(20)} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderTabs = () => (
    <Animated.View 
      style={[
        styles.tabContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.tab,
          selectedTab === 'terms' && styles.activeTab
        ]}
        onPress={() => setSelectedTab('terms')}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.tabText,
          selectedTab === 'terms' && styles.activeTabText
        ]}>
          Terms of Service
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tab,
          selectedTab === 'privacy' && styles.activeTab
        ]}
        onPress={() => setSelectedTab('privacy')}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.tabText,
          selectedTab === 'privacy' && styles.activeTabText
        ]}>
          Privacy Policy
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderTermsContent = () => (
    <View style={styles.contentContainer}>
      <Section title="1. Acceptance of Terms">
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page 
          and updating the "Last Updated" date.
        </Text>
      </Section>

      <Section title="11. Contact Us">
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at:
        </Text>
        <ContactInfo 
          email="privacy@krishiaadhar.com"
          phone="+91 12345 67890"
          address="Bhubaneswar, Odisha, India"
        />
      </Section>
    </View>
  );

  // Add missing renderPrivacyContent function
  const renderPrivacyContent = () => (
    <View style={styles.contentContainer}>
      <Section title="Privacy Policy">
        <Text style={styles.paragraph}>
          This is the Privacy Policy for KrishiAadhar. We value your privacy and are committed to protecting your personal information.
        </Text>
        <BulletPoint text="We collect only the necessary information to provide our services." />
        <BulletPoint text="Your data is stored securely and is not shared with third parties without your consent." />
        <BulletPoint text="You can contact us anytime to request deletion or correction of your data." />
      </Section>
      <Section title="Contact Us">
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at:
        </Text>
        <ContactInfo 
          email="privacy@krishiaadhar.com"
          phone="+91 12345 67890"
          address="Bhubaneswar, Odisha, India"
        />
      </Section>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.scrollContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Last Updated Info */}
          <View style={styles.lastUpdatedContainer}>
            <Text style={styles.lastUpdatedText}>
              Last Updated: January 15, 2024
            </Text>
          </View>

          {/* Content */}
          {selectedTab === 'terms' ? renderTermsContent() : renderPrivacyContent()}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 KrishiAadhar. All rights reserved.
            </Text>
            <TouchableOpacity 
              style={styles.footerButton}
              onPress={handleOpenWebVersion}
            >
              <Text style={styles.footerButtonText}>View Web Version</Text>
              <Ionicons name="open-outline" size={moderateScale(12)} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// Helper Components
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

interface BulletPointProps {
  text: string;
}

const BulletPoint: React.FC<BulletPointProps> = ({ text }) => (
  <View style={styles.bulletPoint}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

interface ContactInfoProps {
  email: string;
  phone: string;
  address: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ email, phone, address }) => (
  <View style={styles.contactInfo}>
    <View style={styles.contactItem}>
      <Ionicons name="mail-outline" size={moderateScale(16)} color={colors.primary} />
      <Text style={styles.contactText}>{email}</Text>
    </View>
    <View style={styles.contactItem}>
      <Ionicons name="call-outline" size={moderateScale(16)} color={colors.primary} />
      <Text style={styles.contactText}>{phone}</Text>
    </View>
    <View style={styles.contactItem}>
      <Ionicons name="location-outline" size={moderateScale(16)} color={colors.primary} />
      <Text style={styles.contactText}>{address}</Text>
    </View>
  </View>
);

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
  webButton: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: horizontalScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: horizontalScale(20),
    marginTop: verticalScale(-10),
    borderRadius: moderateScale(12),
    padding: horizontalScale(4),
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
  tab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textInverse,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
  },
  lastUpdatedContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: moderateScale(8),
    padding: horizontalScale(12),
    marginBottom: verticalScale(20),
    alignItems: 'center',
  },
  lastUpdatedText: {
    fontSize: moderateScale(11),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
  },
  contentContainer: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(16),
    padding: horizontalScale(20),
    marginBottom: verticalScale(20),
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
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: verticalScale(12),
    lineHeight: moderateScale(22),
  },
  paragraph: {
    fontSize: moderateScale(13),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(8),
    textAlign: 'justify',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(6),
    paddingLeft: horizontalScale(8),
  },
  bullet: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Bold',
    color: colors.primary,
    marginRight: horizontalScale(8),
    marginTop: verticalScale(2),
  },
  bulletText: {
    flex: 1,
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    lineHeight: moderateScale(18),
  },
  contactInfo: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: moderateScale(12),
    padding: horizontalScale(16),
    marginTop: verticalScale(8),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  contactText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    marginLeft: horizontalScale(8),
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: verticalScale(20),
    alignItems: 'center',
  },
  footerText: {
    fontSize: moderateScale(11),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginBottom: verticalScale(12),
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  footerButtonText: {
    fontSize: moderateScale(11),
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
    marginRight: horizontalScale(4),
  },
  bottomSpacing: {
    height: verticalScale(40),
  },
});

export default TermsPrivacyScreen;