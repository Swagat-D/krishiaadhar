// src/components/SearchBox.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { horizontalScale, moderateScale, verticalScale, SPACING } from '../utils/metrics';
import { colors } from '../utils/colors';

interface SearchBoxProps {
  placeholder?: string;
  onSearchChange?: (text: string) => void;
  onSearchSubmit?: (text: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ 
  placeholder = "Search for services or help",
  onSearchChange,
  onSearchSubmit 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = new Animated.Value(0);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    onSearchChange?.(text);
  };

  const handleSubmit = () => {
    onSearchSubmit?.(searchQuery);
  };

  const animatedBorderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  const animatedShadowOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.2],
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          borderColor: animatedBorderColor,
          shadowOpacity: animatedShadowOpacity,
        }
      ]}
      >
      <Ionicons
        name="search"
        size={moderateScale(20)}
        color={isFocused ? colors.primary : colors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchQuery.length > 0 && (
        <Ionicons
          name="close-circle"
          size={moderateScale(20)}
          color={colors.textSecondary}
          style={styles.clearIcon}
          onPress={() => handleTextChange('')}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: horizontalScale(16),
    marginVertical: verticalScale(8),
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    
    // Enhanced shadows
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  icon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    color: colors.text,
    fontSize: moderateScale(14),
    fontWeight: '400',
    paddingVertical: Platform.OS === 'ios' ? verticalScale(2) : 0,
  },
  clearIcon: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
});

export default SearchBox;