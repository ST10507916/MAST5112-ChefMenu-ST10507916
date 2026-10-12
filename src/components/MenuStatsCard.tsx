import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MenuStats } from '../utils/menuStats';
import { formatPrice } from '../utils/format';
import { colors, courseColors, fontSizes, radius, spacing } from '../theme';

interface MenuStatsCardProps {
  stats: MenuStats;
}

// Menu statistics: total dishes, overall average price, and the count and average price for each course.
export default function MenuStatsCard({ stats }: MenuStatsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.summaryRow}>
        <View>
          <Text style={styles.summaryValue}>{stats.totalItems}</Text>
          <Text style={styles.summaryLabel}>{stats.totalItems === 1 ? 'Dish on the menu' : 'Dishes on the menu'}</Text>
        </View>
        <View style={styles.alignRight}>
          <Text style={styles.summaryValue}>
            {stats.averagePrice === null ? '-' : formatPrice(stats.averagePrice)}
          </Text>
          <Text style={styles.summaryLabel}>Average price</Text>
        </View>
      </View>

      <View style={styles.courseRow}>
        {stats.byCourse.map((course) => (
          <View key={course.course} style={styles.courseCell}>
            <View style={[styles.dot, { backgroundColor: courseColors[course.course].text }]} />
            <Text style={styles.courseName}>{course.course}</Text>
            <Text style={styles.courseCount}>
              {course.count} {course.count === 1 ? 'dish' : 'dishes'}
            </Text>
            <Text style={styles.courseAverage}>
              {course.averagePrice === null ? 'No dishes yet' : `Avg ${formatPrice(course.averagePrice)}`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  summaryValue: {
    fontSize: fontSizes.title,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  summaryLabel: {
    marginTop: 2,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  courseRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  courseCell: {
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  courseName: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: colors.text,
  },
  courseCount: {
    marginTop: 2,
    fontSize: fontSizes.small,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  courseAverage: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
});
