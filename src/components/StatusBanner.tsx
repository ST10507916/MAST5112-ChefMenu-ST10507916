import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fontSizes, radius, spacing } from '../theme';

interface StatusBannerProps {
  type: 'success' | 'error';
  title?: string;
  message: string;
  style?: ViewStyle;
}

// One banner component for both confirmation messages and form error summaries.
export default function StatusBanner({ type, title, message, style }: StatusBannerProps) {
  const isSuccess = type === 'success';

  return (
    <View
      style={[styles.banner, isSuccess ? styles.success : styles.error, style]}
      accessibilityLiveRegion="polite"
    >
      {title ? (
        <Text style={[styles.title, { color: isSuccess ? colors.success : colors.error }]}>{title}</Text>
      ) : null}
      <Text style={[styles.message, !isSuccess && !title && styles.errorMessage]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderLeftWidth: 4,
    borderRadius: radius,
    padding: spacing.md,
  },
  success: {
    backgroundColor: colors.successBackground,
    borderLeftColor: colors.success,
  },
  error: {
    backgroundColor: colors.errorBackground,
    borderLeftColor: colors.error,
  },
  title: {
    fontSize: fontSizes.label,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    fontSize: fontSizes.label,
    color: colors.text,
  },
  errorMessage: {
    color: colors.error,
    fontWeight: '600',
  },
});
