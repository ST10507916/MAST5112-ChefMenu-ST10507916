import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import { colors, fontSizes, spacing } from '../theme';

interface EmptyStateProps {
  title: string;
  message: string;
  showIcon?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

// A friendly message shown when there is nothing to display, with an optional button.
export default function EmptyState({ title, message, showIcon = false, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {showIcon ? (
        <View style={styles.icon}>
          <Text style={styles.iconText}>+</Text>
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} variant="secondary" style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconText: {
    fontSize: 30,
    color: colors.placeholder,
  },
  title: {
    fontSize: fontSizes.heading,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSizes.body,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.lg,
  },
});
