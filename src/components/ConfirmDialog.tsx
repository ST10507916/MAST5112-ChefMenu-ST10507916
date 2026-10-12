import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import { colors, fontSizes, radius, spacing } from '../theme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean; // shows the confirm button in red
  onConfirm: () => void;
  onCancel: () => void;
}

// An in-app confirmation popup. Used instead of Alert so it looks the same on Android, iOS and web.
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.dialog} accessibilityRole="alert">
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <AppButton label={cancelLabel} onPress={onCancel} variant="secondary" style={styles.action} />
            <AppButton
              label={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? 'danger' : 'primary'}
              style={styles.action}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 24, 36, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius + 4,
    padding: spacing.xl,
  },
  title: {
    fontSize: fontSizes.heading,
    fontWeight: '700',
    color: colors.text,
  },
  message: {
    marginTop: spacing.sm,
    fontSize: fontSizes.body,
    lineHeight: 22,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  action: {
    flex: 1,
  },
});
