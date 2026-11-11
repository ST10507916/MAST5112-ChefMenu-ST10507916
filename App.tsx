import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MenuListScreen, { BannerMessage } from './src/screens/MenuListScreen';
import MenuItemFormScreen from './src/screens/MenuItemFormScreen';
import DishDetailsScreen from './src/screens/DishDetailsScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import TabBar from './src/components/TabBar';
import { MenuProvider, useMenu } from './src/context/MenuContext';
import { MenuItem, Route, Tab } from './src/types';
import { colors } from './src/theme';

const BANNER_DURATION_MS = 4000;
const UNDO_BANNER_DURATION_MS = 6000; // a little longer so the chef has time to tap Undo

// Chooses which screen to show and handles moving between them.
// The menu data itself lives in MenuContext.
function AppContent() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, restoreMenuItem, getMenuItem } = useMenu();
  const [route, setRoute] = useState<Route>({ name: 'list' });
  const [banner, setBanner] = useState<BannerMessage | null>(null);

  // Hide the confirmation banner a few seconds after it appears.
  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(null), banner.onAction ? UNDO_BANNER_DURATION_MS : BANNER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [banner]);

  // If the dish on screen no longer exists (for example it was just deleted), return to the list.
  useEffect(() => {
    const itemId = route.name === 'details' || route.name === 'form' ? route.itemId : undefined;
    if (itemId && !getMenuItem(itemId)) {
      setRoute({ name: 'list' });
    }
  }, [route, menuItems]);

  const goToList = (message?: BannerMessage) => {
    setBanner(message ?? null);
    setRoute({ name: 'list' });
  };

  const openDetails = (itemId: string) => {
    setBanner(null);
    setRoute({ name: 'details', itemId });
  };

  const openAddForm = () => {
    setBanner(null);
    setRoute({ name: 'form' });
  };

  const changeTab = (tab: Tab) => {
    setBanner(null);
    setRoute(tab === 'menu' ? { name: 'list' } : { name: 'stats' });
  };

  const handleSave = (item: MenuItem, isEditing: boolean) => {
    if (isEditing) {
      updateMenuItem(item);
      goToList({ title: 'Changes saved', message: `${item.dishName} has been updated.` });
    } else {
      addMenuItem(item);
      goToList({ title: 'Menu item added', message: `${item.dishName} has been added to the menu.` });
    }
  };

  const handleDelete = (item: MenuItem) => {
    const deleted = deleteMenuItem(item.id);
    goToList({
      title: 'Menu item deleted',
      message: `${item.dishName} has been removed from the menu.`,
      actionLabel: deleted ? 'Undo' : undefined,
      onAction: deleted
        ? () => {
            restoreMenuItem(deleted);
            setBanner({ title: 'Deletion undone', message: `${item.dishName} is back on the menu.` });
          }
        : undefined,
    });
  };

  if (route.name === 'details') {
    const item = getMenuItem(route.itemId);
    if (!item) {
      return null; // the effect above sends the chef back to the list
    }
    return (
      <DishDetailsScreen
        item={item}
        onBack={() => goToList()}
        onEdit={() => setRoute({ name: 'form', itemId: item.id })}
        onDelete={() => handleDelete(item)}
      />
    );
  }

  if (route.name === 'form') {
    const editingItem = route.itemId ? getMenuItem(route.itemId) : undefined;
    const otherNames = menuItems.filter((item) => item.id !== editingItem?.id).map((item) => item.dishName);
    return (
      <MenuItemFormScreen
        key={editingItem?.id ?? 'new'}
        initialItem={editingItem}
        existingNames={otherNames}
        onSave={(item) => handleSave(item, editingItem !== undefined)}
        onCancel={() => (editingItem ? setRoute({ name: 'details', itemId: editingItem.id }) : goToList())}
      />
    );
  }

  // The two main sections share the tab bar at the bottom.
  const activeTab: Tab = route.name === 'stats' ? 'stats' : 'menu';

  return (
    <View style={styles.flex}>
      <View style={styles.flex}>
        {activeTab === 'stats' ? (
          <StatisticsScreen onItemPress={openDetails} onAddPress={openAddForm} />
        ) : (
          <MenuListScreen
            banner={banner}
            onAddPress={openAddForm}
            onItemPress={openDetails}
            onStatsPress={() => changeTab('stats')}
          />
        )}
      </View>
      <TabBar activeTab={activeTab} onChange={changeTab} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <StatusBar style="dark" />
          <AppContent />
        </SafeAreaView>
      </MenuProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.header,
  },
  flex: {
    flex: 1,
  },
});
