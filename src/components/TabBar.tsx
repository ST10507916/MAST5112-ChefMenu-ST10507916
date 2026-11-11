import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Tab } from '../types';
import { colors, fontSizes, spacing } from '../theme';

const TABS: { label: string; value: Tab }[] = [
  { label: 'Menu', value: 'menu' },
  { label: 'Statistics', value: 'stats' },
];

interface TabBarProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

// Simple icons drawn with Views, so they look the same on every device without an icon library.
function TabIcon({ tab, color }: { tab: Tab; color: string }) {
  if (tab === 'menu') {
    // Three lines, like a list of dishes.
    return (
      <View style={styles.iconBox}>
        {[0, 1, 2].map((line) => (
          <View key={line} style={[styles.menuLine, { backgroundColor: color }]} />
        ))}
      </View>
    );
  }
  // Three bars of different heights, like a bar chart.
  return (
    <View style={[styles.iconBox, styles.chartBox]}>
      {[8, 14, 11].map((height, index) => (
        <View key={index} style={[styles.chartBar, { height, backgroundColor: color }]} />
      ))}
    </View>
  );
}

// The bar at the bottom of the main screens for moving between the menu and the statistics.
export default function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {TABS.map(({ label, value }) => {
        const isActive = activeTab === value;
        const color = isActive ? colors.primary : colors.placeholder;
        return (
          <TouchableOpacity
            key={value}
            style={styles.tab}
            onPress={() => onChange(value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
          >
            <View style={[styles.indicator, isActive && styles.indicatorActive]} />
            <TabIcon tab={value} color={color} />
            <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  indicator: {
    alignSelf: 'stretch',
    height: 3,
    marginHorizontal: spacing.xl * 2,
    marginBottom: spacing.sm,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: colors.primary,
  },
  iconBox: {
    width: 18,
    height: 14,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    borderRadius: 1,
  },
  chartBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  chartBar: {
    flex: 1,
    borderRadius: 1,
  },
  label: {
    marginTop: spacing.xs,
    fontSize: fontSizes.small,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
