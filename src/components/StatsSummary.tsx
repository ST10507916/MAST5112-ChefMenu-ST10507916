import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MenuStats } from '../utils/menuStats';
import { formatPrice } from '../utils/format';
import { COURSE_PLURAL_LABELS } from '../constants/courses';
import { cardStyle } from './Card';
import { colors, courseColors, fontSizes, spacing } from '../theme';

interface StatsSummaryProps {
  stats: MenuStats;
  onPress: () => void;
}

// A short version of the menu statistics at the top of the home screen. Tapping it opens the Statistics tab.
export default function StatsSummary({ stats, onPress }: StatsSummaryProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${stats.totalItems} dishes, average price ${
        stats.averagePrice === null ? 'none' : formatPrice(stats.averagePrice)
      }. View full statistics.`}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={styles.value}>{stats.totalItems}</Text>
          <Text style={styles.label}>{stats.totalItems === 1 ? 'Dish on the menu' : 'Dishes on the menu'}</Text>
        </View>
        <View style={styles.alignRight}>
          <Text style={styles.value}>{stats.averagePrice === null ? '-' : formatPrice(stats.averagePrice)}</Text>
          <Text style={styles.label}>Average price</Text>
        </View>
      </View>

      <View style={styles.courseRow}>
        {stats.byCourse.map((course) => (
          <View key={course.course} style={styles.coursePill}>
            <View style={[styles.dot, { backgroundColor: courseColors[course.course].text }]} />
            <Text style={styles.courseText}>
              {COURSE_PLURAL_LABELS[course.course]} {course.count}
            </Text>
          </View>
        ))}
        <Text style={styles.link}>View statistics {'›'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardStyle,
    marginBottom: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: fontSizes.title,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  coursePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  courseText: {
    fontSize: fontSizes.small,
    fontWeight: '600',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  link: {
    marginLeft: 'auto',
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: colors.primary,
  },
});
