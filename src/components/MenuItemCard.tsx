import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MenuItem } from '../types';
import { formatPrice } from '../utils/format';
import { cardStyle } from './Card';
import CourseBadge from './CourseBadge';
import { colors, fontSizes, spacing } from '../theme';

interface MenuItemCardProps {
  item: MenuItem;
  onPress: () => void;
}

// One row in the menu list. Tapping it opens the Dish Details screen.
export default function MenuItemCard({ item, onPress }: MenuItemCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${item.dishName}, ${item.course}, ${formatPrice(item.price)}. Open details.`}
    >
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

        <CourseBadge course={item.course} style={styles.badge} />

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <Text style={styles.chevron}>{'›'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardStyle,
    flexDirection: 'row',
    alignItems: 'center',
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
    alignSelf: 'flex-start',
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
    marginTop: spacing.xs,
  },
  description: {
    marginTop: spacing.sm,
    fontSize: fontSizes.label,
    lineHeight: 20,
    color: colors.textMuted,
  },
  chevron: {
    marginLeft: spacing.sm,
    fontSize: 24,
    color: colors.placeholder,
  },
});
