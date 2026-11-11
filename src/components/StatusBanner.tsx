import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { colors, fontSizes, radius, spacing } from '../theme';

interface StatusBannerProps {
  type: 'success' | 'error';
  title?: string;
  message: string;
  style?: ViewStyle;
  actionLabel?: string; // for example "Undo"
  onAction?: () => void;
}

// One banner component for both confirmation messages and form error summaries.
export default function StatusBanner({ type, title, message, style, actionLabel, onAction }: StatusBannerProps) {
  const isSuccess = type === 'success';

  return (
    <View
      style={[styles.banner, isSuccess ? styles.success : styles.error, style]}
      accessibilityLiveRegion="polite"
    >
      <View style={styles.textBlock}>
        {title ? (
          <Text style={[styles.title, { color: isSuccess ? colors.success : colors.error }]}>{title}</Text>
        ) : null}
        <Text style={[styles.message, !isSuccess && !title && styles.errorMessage]}>{message}</Text>
      </View>
      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          style={styles.action}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={8}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
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
  textBlock: {
    flex: 1,
  },
  action: {
    marginLeft: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: radius,
    borderWidth: 1.5,
    borderColor: colors.success,
    backgroundColor: colors.surface,
  },
  actionText: {
    fontSize: fontSizes.label,
    fontWeight: '700',
    color: colors.success,
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
