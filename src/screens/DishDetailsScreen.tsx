import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import ConfirmDialog from '../components/ConfirmDialog';
import Card from '../components/Card';
import CourseBadge from '../components/CourseBadge';
import { MenuItem } from '../types';
import { formatPrice } from '../utils/format';
import { colors, fontSizes, spacing } from '../theme';

interface DishDetailsScreenProps {
  item: MenuItem;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Screen 3: the full details of one dish, with Edit and Delete buttons (from the Part 1 wireframe).
export default function DishDetailsScreen({ item, onBack, onEdit, onDelete }: DishDetailsScreenProps) {
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <View style={styles.screen}>
      <AppHeader title="Dish Details" subtitle="View, edit or remove this dish" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <CourseBadge course={item.course} />
          <Text style={styles.dishName}>{item.dishName}</Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Card>

        <View style={styles.actions}>
          <AppButton label="Edit Menu Item" onPress={onEdit} />
          <AppButton label="Delete Menu Item" onPress={() => setConfirmVisible(true)} variant="danger" />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirmVisible}
        title="Delete this item?"
        message={`${item.dishName} will be removed from the menu. This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="No, keep it"
        destructive
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          onDelete();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  card: {
    padding: spacing.lg,
  },
  dishName: {
    marginTop: spacing.sm,
    fontSize: fontSizes.title + 2,
    fontWeight: '700',
    color: colors.text,
  },
  price: {
    marginTop: spacing.xs,
    fontSize: fontSizes.title,
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  sectionLabel: {
    fontSize: fontSizes.small,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSizes.body,
    lineHeight: 23,
    color: colors.text,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
});
