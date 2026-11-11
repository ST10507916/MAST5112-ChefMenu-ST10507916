import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import MenuItemCard from '../components/MenuItemCard';
import StatusBanner from '../components/StatusBanner';
import SearchBar from '../components/SearchBar';
import CourseFilterChips from '../components/CourseFilterChips';
import StatsSummary from '../components/StatsSummary';
import EmptyState from '../components/EmptyState';
import OptionSheet from '../components/OptionSheet';
import { useMenu } from '../context/MenuContext';
import { useMenuFilters } from '../hooks/useMenuFilters';
import { getMenuStats } from '../utils/menuStats';
import { SORT_OPTIONS, getSortLabel } from '../utils/sortMenu';
import { colors, fontSizes, radius, spacing } from '../theme';

export interface BannerMessage {
  title: string;
  message: string;
  actionLabel?: string; // for example "Undo"
  onAction?: () => void;
}

interface MenuListScreenProps {
  banner: BannerMessage | null;
  onAddPress: () => void;
  onItemPress: (itemId: string) => void;
  onStatsPress: () => void;
}

// Screen 1 (Home): statistics summary, search, course filter, sorting and the list of dishes.
export default function MenuListScreen({ banner, onAddPress, onItemPress, onStatsPress }: MenuListScreenProps) {
  const { menuItems, isLoaded } = useMenu();
  const {
    searchText,
    setSearchText,
    courseFilter,
    setCourseFilter,
    sortOrder,
    setSortOrder,
    visibleItems,
    isFiltering,
    clearFilters,
  } = useMenuFilters(menuItems);
  const [sortSheetVisible, setSortSheetVisible] = useState(false);
  const stats = useMemo(() => getMenuStats(menuItems), [menuItems]);

  const hasItems = menuItems.length > 0;

  // Two different empty states: an empty menu, and a search or filter with no matches.
  const renderEmpty = () =>
    hasItems ? (
      <EmptyState
        title="No matching dishes"
        message={
          searchText.trim().length > 0
            ? `No dishes match "${searchText.trim()}"${courseFilter !== 'All' ? ` in ${courseFilter}` : ''}. Try a different word or course.`
            : `There are no ${courseFilter} dishes on the menu yet.`
        }
        actionLabel="Show all dishes"
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
        <StatusBanner
          type="success"
          title={banner.title}
          message={banner.message}
          actionLabel={banner.actionLabel}
          onAction={banner.onAction}
          style={styles.banner}
        />
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
        // FlatList re-renders automatically whenever the menu, search, filter or sort changes.
        <FlatList
          data={visibleItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MenuItemCard item={item} onPress={() => onItemPress(item.id)} />}
          contentContainerStyle={[styles.listContent, visibleItems.length === 0 && styles.emptyListContent]}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            hasItems ? (
              <>
                {!isFiltering ? <StatsSummary stats={stats} onPress={onStatsPress} /> : null}
                <View style={styles.listToolbar}>
                  <Text style={styles.resultCount} numberOfLines={1}>
                    {isFiltering
                      ? `${visibleItems.length} of ${menuItems.length} shown`
                      : `All dishes (${menuItems.length})`}
                  </Text>
                  {isFiltering ? (
                    <TouchableOpacity onPress={clearFilters} accessibilityRole="button" hitSlop={8}>
                      <Text style={styles.clearAll}>Clear all</Text>
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setSortSheetVisible(true)}
                    accessibilityRole="button"
                    accessibilityLabel={`Sort by ${getSortLabel(sortOrder)}. Change sort order.`}
                  >
                    <Text style={styles.sortText}>
                      Sort: {getSortLabel(sortOrder)} {'▾'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null
          }
          ListEmptyComponent={renderEmpty}
        />
      )}

      <View style={styles.footer}>
        <AppButton label="+  Add New Menu Item" onPress={onAddPress} />
      </View>

      <OptionSheet
        visible={sortSheetVisible}
        title="Sort menu items"
        options={SORT_OPTIONS}
        selected={sortOrder}
        onSelect={setSortOrder}
        onClose={() => setSortSheetVisible(false)}
      />
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
  loadingText: {
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
  listContent: {
    padding: spacing.lg,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  listToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  resultCount: {
    flexShrink: 1,
    fontSize: fontSizes.small,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  clearAll: {
    fontSize: fontSizes.small + 1,
    fontWeight: '700',
    color: colors.error,
  },
  sortButton: {
    marginLeft: 'auto',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  sortText: {
    fontSize: fontSizes.small + 1,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
