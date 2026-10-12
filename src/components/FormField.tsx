import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, spacing } from '../theme';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helper?: string; // small text on the right, such as a character counter
  children: ReactNode; // the input itself
}

// Wraps any input with its label, required marker and error message, so every field looks the same.
export default function FormField({ label, required, error, helper, children }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label} {required ? <Text style={styles.required}>*</Text> : null}
      </Text>
      {children}
      {error || helper ? (
        <View style={styles.helperRow}>
          <Text style={[styles.errorText, styles.flex]}>{error ?? ''}</Text>
          {helper ? <Text style={styles.helper}>{helper}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: spacing.md,
  },
  flex: {
    flex: 1,
  },
  label: {
    fontSize: fontSizes.label,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs + 2,
  },
  required: {
    color: colors.error,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: fontSizes.small + 1,
    color: colors.error,
  },
  helper: {
    marginLeft: spacing.sm,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
});
