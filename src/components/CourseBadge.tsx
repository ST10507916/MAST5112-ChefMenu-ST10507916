import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Course } from '../types';
import { courseColors, fontSizes, spacing } from '../theme';

interface CourseBadgeProps {
  course: Course;
  style?: ViewStyle;
}

// The coloured course label shown on dish cards and the details screen.
export default function CourseBadge({ course, style }: CourseBadgeProps) {
  const badge = courseColors[course];

  return (
    <View style={[styles.badge, { backgroundColor: badge.background }, style]}>
      <Text style={[styles.text, { color: badge.text }]}>{course}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: fontSizes.small,
    fontWeight: '600',
  },
});
