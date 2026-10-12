import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CourseFilter } from '../types';
import { colors, fontSizes, spacing } from '../theme';

// Chip labels match the Part 1 wireframe.
const FILTERS: { label: string; value: CourseFilter }[] = [
  { label: 'All', value: 'All' },
  { label: 'Starters', value: 'Starter' },
  { label: 'Mains', value: 'Main Course' },
  { label: 'Desserts', value: 'Dessert' },
];

interface CourseFilterChipsProps {
  selected: CourseFilter;
  onSelect: (filter: CourseFilter) => void;
}

// The row of filter chips at the top of the menu list.
export default function CourseFilterChips({ selected, onSelect }: CourseFilterChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {FILTERS.map(({ label, value }) => {
        const isActive = selected === value;
        return (
          <TouchableOpacity
            key={value}
            onPress={() => onSelect(value)}
            style={[styles.chip, isActive && styles.chipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm - 2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: fontSizes.label - 1,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.primaryText,
  },
});
