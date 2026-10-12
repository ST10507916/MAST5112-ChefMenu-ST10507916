import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MenuItem } from '../types';
import { colors, courseColors, fontSizes, radius, spacing } from '../theme';

interface MenuItemCardProps {
  item: MenuItem;
}

// Formats a price in South African Rand, for example 185 becomes "R185.00".
export function formatPrice(price: number): string {
  return `R${price.toFixed(2)}`;
}

// One row in the menu list: dish initial, name, course badge, description and price.
export default function MenuItemCard({ item }: MenuItemCardProps) {
  const badge = courseColors[item.course];

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.dishName.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.topRow}>
          <Text style={styles.dishName} numberOfLines={1}>
            {item.dishName}
          </Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: badge.background }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>{item.course}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.header,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: fontSizes.heading,
    fontWeight: '700',
    color: colors.primary,
  },
  details: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishName: {
    flex: 1,
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.sm,
  },
  price: {
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.primary,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  badgeText: {
    fontSize: fontSizes.small,
    fontWeight: '600',
  },
  description: {
    marginTop: spacing.sm,
    fontSize: fontSizes.label,
    lineHeight: 20,
    color: colors.textMuted,
  },
});
