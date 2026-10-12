import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MenuListScreen from './src/screens/MenuListScreen';
import AddMenuItemScreen from './src/screens/AddMenuItemScreen';
import { MenuItem, Screen } from './src/types';
import { colors } from './src/theme';

// ChefMenu, Part 2: lets the chef add menu items and view them in a list.
// The menu items live in App so that both screens share the same data.
export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hide the confirmation banner a few seconds after it appears.
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // Adds the new dish to the list, returns to the menu and confirms the save.
  const handleSaveMenuItem = (item: MenuItem) => {
    setMenuItems((previousItems) => [...previousItems, item]);
    setCurrentScreen('list');
    setSuccessMessage(`${item.dishName} has been added to the menu.`);

    if (Platform.OS !== 'web') {
      Alert.alert('Menu Item Added', `${item.dishName} was saved successfully.`);
    }
  };

  const openAddScreen = () => {
    setSuccessMessage(null);
    setCurrentScreen('add');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        {currentScreen === 'list' ? (
          <MenuListScreen
            menuItems={menuItems}
            successMessage={successMessage}
            onAddPress={openAddScreen}
          />
        ) : (
          <AddMenuItemScreen
            onSave={handleSaveMenuItem}
            onCancel={() => setCurrentScreen('list')}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.header,
  },
});
