import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, fontSizes, radius, spacing } from '../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

// Search box for finding a dish by name or description, with a clear button.
export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search dishes..."
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Search dishes"
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.clear}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  clear: {
    paddingLeft: spacing.sm,
  },
  clearText: {
    fontSize: fontSizes.label - 1,
    fontWeight: '600',
    color: colors.primary,
  },
});
