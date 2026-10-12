import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import MenuItemCard from '../components/MenuItemCard';
import StatusBanner from '../components/StatusBanner';
import { useMenu } from '../context/MenuContext';
import { colors, fontSizes, spacing } from '../theme';

interface MenuListScreenProps {
  successMessage: string | null;
  onAddPress: () => void;
}

// Screen 1 (Home): shows every menu item that has been added, or a friendly message when the menu is empty.
export default function MenuListScreen({ successMessage, onAddPress }: MenuListScreenProps) {
  const { menuItems } = useMenu();

  return (
    <View style={styles.screen}>
      <AppHeader title="Chef's Menu Manager" subtitle="Manage your restaurant dishes" />

      {/* Confirmation banner shown after a dish has been saved */}
      {successMessage ? (
        <StatusBanner type="success" title="Menu item added" message={successMessage} style={styles.banner} />
      ) : null}

      {/* FlatList re-renders automatically whenever the menuItems array changes */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MenuItemCard item={item} />}
        contentContainerStyle={[
          styles.listContent,
          menuItems.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>+</Text>
            </View>
            <Text style={styles.emptyTitle}>No menu items yet</Text>
            <Text style={styles.emptyText}>
              Your menu is empty. Tap "Add New Menu Item" below to add your first dish.
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <AppButton label="+  Add New Menu Item" onPress={onAddPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  banner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  listContent: {
    padding: spacing.lg,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyIconText: {
    fontSize: 30,
    color: colors.placeholder,
  },
  emptyTitle: {
    fontSize: fontSizes.heading,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSizes.body,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
