import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

// The white rounded box used for dish cards, statistics and dish details, so they all share one look.
export default function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export const cardStyle = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius,
  padding: spacing.md,
} as const;

const styles = StyleSheet.create({
  card: cardStyle,
});
