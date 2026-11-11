import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import CourseBadge from '../components/CourseBadge';
import EmptyState from '../components/EmptyState';
import { useMenu } from '../context/MenuContext';
import { getMenuStats } from '../utils/menuStats';
import { formatPercent, formatPrice, pluralise } from '../utils/format';
import { COURSE_PLURAL_LABELS } from '../constants/courses';
import { MenuItem } from '../types';
import { colors, courseColors, fontSizes, spacing } from '../theme';

interface StatisticsScreenProps {
  onItemPress: (itemId: string) => void;
  onAddPress: () => void;
}

// Screen 4: a full overview of the menu. Totals, average price, dishes per course and price range.
export default function StatisticsScreen({ onItemPress, onAddPress }: StatisticsScreenProps) {
  const { menuItems } = useMenu();
  const stats = useMemo(() => getMenuStats(menuItems), [menuItems]);

  if (stats.totalItems === 0) {
    return (
      <View style={styles.screen}>
        <AppHeader title="Menu Statistics" subtitle="An overview of your menu" />
        <EmptyState
          showIcon
          title="No statistics yet"
          message="Statistics appear once you have added dishes to the menu."
          actionLabel="Add your first dish"
          onAction={onAddPress}
        />
      </View>
    );
  }

  const busiestCount = Math.max(...stats.byCourse.map((course) => course.count));

  return (
    <View style={styles.screen}>
      <AppHeader title="Menu Statistics" subtitle="An overview of your menu" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Headline figures */}
        <View style={styles.tileRow}>
          <Card style={styles.tile}>
            <Text style={styles.tileLabel}>Total menu items</Text>
            <Text style={styles.tileValue}>{stats.totalItems}</Text>
            <Text style={styles.tileNote}>across 3 courses</Text>
          </Card>
          <Card style={styles.tile}>
            <Text style={styles.tileLabel}>Average price</Text>
            <Text style={styles.tileValue}>{formatPrice(stats.averagePrice ?? 0)}</Text>
            <Text style={styles.tileNote}>of all menu items</Text>
          </Card>
        </View>

        {/* Dishes per course */}
        <Text style={styles.sectionTitle}>Menu items per course</Text>
        <Card>
          {stats.byCourse.map((course, index) => (
            <View
              key={course.course}
              style={[styles.courseRow, index < stats.byCourse.length - 1 && styles.courseRowDivider]}
            >
              <View style={styles.courseHeader}>
                <Text style={styles.courseName}>{COURSE_PLURAL_LABELS[course.course]}</Text>
                <Text style={styles.courseCount}>{pluralise(course.count, 'dish', 'dishes')}</Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: busiestCount === 0 ? 0 : `${(course.count / busiestCount) * 100}%`,
                      backgroundColor: courseColors[course.course].text,
                    },
                  ]}
                />
              </View>
              <View style={styles.courseFooter}>
                <Text style={styles.courseMeta}>{formatPercent(course.share)} of the menu</Text>
                <Text style={styles.courseMeta}>
                  {course.averagePrice === null ? 'No dishes yet' : `Average ${formatPrice(course.averagePrice)}`}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Price range */}
        <Text style={styles.sectionTitle}>Price range</Text>
        <Card>
          {stats.highestPriced ? (
            <PriceRow label="Highest priced dish" item={stats.highestPriced} onPress={onItemPress} />
          ) : null}
          {stats.lowestPriced && stats.lowestPriced.id !== stats.highestPriced?.id ? (
            <PriceRow label="Lowest priced dish" item={stats.lowestPriced} onPress={onItemPress} divider />
          ) : null}
        </Card>
      </ScrollView>
    </View>
  );
}

interface PriceRowProps {
  label: string;
  item: MenuItem;
  onPress: (itemId: string) => void;
  divider?: boolean;
}

// One dish in the price range card. Tapping it opens the dish details.
function PriceRow({ label, item, onPress, divider }: PriceRowProps) {
  return (
    <TouchableOpacity
      style={[styles.priceRow, divider && styles.priceRowDivider]}
      onPress={() => onPress(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${item.dishName}, ${formatPrice(item.price)}. Open details.`}
    >
      <View style={styles.priceInfo}>
        <Text style={styles.priceLabel}>{label}</Text>
        <Text style={styles.priceDish} numberOfLines={1}>
          {item.dishName}
        </Text>
        <CourseBadge course={item.course} style={styles.priceBadge} />
      </View>
      <Text style={styles.priceValue}>{formatPrice(item.price)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  tileRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tile: {
    flex: 1,
  },
  tileLabel: {
    fontSize: fontSizes.small,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  tileValue: {
    marginTop: spacing.xs,
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  tileNote: {
    marginTop: 2,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  sectionTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    fontSize: fontSizes.small,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  courseRow: {
    paddingVertical: spacing.sm,
  },
  courseRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.md,
    marginBottom: spacing.xs,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  courseName: {
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.text,
  },
  courseCount: {
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.header,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs + 2,
  },
  courseMeta: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  priceRowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  priceInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  priceLabel: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  priceDish: {
    marginTop: 2,
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.text,
  },
  priceBadge: {
    marginTop: spacing.xs,
  },
  priceValue: {
    fontSize: fontSizes.heading,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
});
