import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import MenuItemCard from '../components/MenuItemCard';
import StatusBanner from '../components/StatusBanner';
import SearchBar from '../components/SearchBar';
import CourseFilterChips from '../components/CourseFilterChips';
import MenuStatsCard from '../components/MenuStatsCard';
import { useMenu } from '../context/MenuContext';
import EmptyState from '../components/EmptyState';
import { useMenuFilters } from '../hooks/useMenuFilters';
import { getMenuStats } from '../utils/menuStats';
import { colors, fontSizes, spacing } from '../theme';

export interface BannerMessage {
  title: string;
  message: string;
}

interface MenuListScreenProps {
  banner: BannerMessage | null;
  onAddPress: () => void;
  onItemPress: (itemId: string) => void;
}

// Screen 1 (Home): menu statistics, search, course filter and the list of dishes.
export default function MenuListScreen({ banner, onAddPress, onItemPress }: MenuListScreenProps) {
  const { menuItems, isLoaded } = useMenu();
  const { searchText, setSearchText, courseFilter, setCourseFilter, visibleItems, isFiltering, clearFilters } =
    useMenuFilters(menuItems);
  const stats = useMemo(() => getMenuStats(menuItems), [menuItems]);

  const hasItems = menuItems.length > 0;

  // Two different empty states: an empty menu, and a search or filter with no matches.
  const renderEmpty = () =>
    hasItems ? (
      <EmptyState
        title="No matching dishes"
        message="No dishes match your search or filter. Try a different word or course."
        actionLabel="Clear search and filter"
        onAction={clearFilters}
      />
    ) : (
      <EmptyState
        showIcon
        title="No menu items yet"
        message='Your menu is empty. Tap "Add New Menu Item" below to add your first dish.'
      />
    );

  return (
    <View style={styles.screen}>
      <AppHeader title="Chef's Menu Manager" subtitle="Manage your restaurant dishes" />

      {banner ? (
        <StatusBanner type="success" title={banner.title} message={banner.message} style={styles.banner} />
      ) : null}

      {hasItems ? (
        <View style={styles.controls}>
          <SearchBar value={searchText} onChangeText={setSearchText} />
          <CourseFilterChips selected={courseFilter} onSelect={setCourseFilter} />
        </View>
      ) : null}

      {!isLoaded ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Loading your menu...</Text>
        </View>
      ) : (
        // FlatList re-renders automatically whenever the menu, search or filter changes.
        <FlatList
          data={visibleItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MenuItemCard item={item} onPress={() => onItemPress(item.id)} />}
          contentContainerStyle={[styles.listContent, visibleItems.length === 0 && styles.emptyListContent]}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            hasItems ? (
              <>
                <MenuStatsCard stats={stats} />
                <Text style={styles.resultCount}>
                  {isFiltering
                    ? `Showing ${visibleItems.length} of ${menuItems.length} dishes`
                    : `All dishes (${menuItems.length})`}
                </Text>
              </>
            ) : null
          }
          ListEmptyComponent={renderEmpty}
        />
      )}

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
  controls: {
    gap: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  listContent: {
    padding: spacing.lg,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  resultCount: {
    fontSize: fontSizes.small,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  loadingText: {
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
