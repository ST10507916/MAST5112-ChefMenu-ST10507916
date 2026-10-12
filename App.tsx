import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MenuListScreen, { BannerMessage } from './src/screens/MenuListScreen';
import MenuItemFormScreen from './src/screens/MenuItemFormScreen';
import DishDetailsScreen from './src/screens/DishDetailsScreen';
import { MenuProvider, useMenu } from './src/context/MenuContext';
import { MenuItem, Route } from './src/types';
import { colors } from './src/theme';

// Chooses which screen to show and handles moving between them.
// The menu data itself lives in MenuContext.
function AppContent() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, getMenuItem } = useMenu();
  const [route, setRoute] = useState<Route>({ name: 'list' });
  const [banner, setBanner] = useState<BannerMessage | null>(null);

  // Hide the confirmation banner a few seconds after it appears.
  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(timer);
  }, [banner]);

  // If the dish on screen no longer exists (for example it was just deleted), return to the list.
  useEffect(() => {
    const itemId = route.name === 'list' ? undefined : route.itemId;
    if (itemId && !getMenuItem(itemId)) {
      setRoute({ name: 'list' });
    }
  }, [route, menuItems]);

  const goToList = (message?: BannerMessage) => {
    setBanner(message ?? null);
    setRoute({ name: 'list' });
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
        onDelete={() => {
          deleteMenuItem(item.id);
          goToList({ title: 'Menu item deleted', message: `${item.dishName} has been removed from the menu.` });
        }}
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

  return (
    <MenuListScreen
      banner={banner}
      onAddPress={() => {
        setBanner(null);
        setRoute({ name: 'form' });
      }}
      onItemPress={(itemId) => {
        setBanner(null);
        setRoute({ name: 'details', itemId });
      }}
    />
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
});
