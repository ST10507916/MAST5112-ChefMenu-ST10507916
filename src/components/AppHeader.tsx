import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fontSizes, spacing } from '../theme';

interface AppHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void; // when provided, a back arrow is shown
}

// The header shown at the top of every screen: screen title plus a short subtitle.
export default function AppHeader({ title, subtitle, onBack }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
          >
            <Text style={styles.backArrow}>{'‹'}</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={[styles.title, !onBack && styles.centeredTitle]}>{title}</Text>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.header,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
  },
  backButton: {
    paddingRight: spacing.md,
  },
  backArrow: {
    fontSize: 32,
    lineHeight: 34,
    color: colors.text,
  },
  title: {
    fontSize: fontSizes.title,
    fontWeight: '700',
    color: colors.text,
  },
  centeredTitle: {
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSizes.small,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});
