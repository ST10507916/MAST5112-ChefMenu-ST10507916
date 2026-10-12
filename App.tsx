import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MenuListScreen from './src/screens/MenuListScreen';
import MenuItemFormScreen from './src/screens/MenuItemFormScreen';
import { MenuProvider, useMenu } from './src/context/MenuContext';
import { MenuItem, Screen } from './src/types';
import { colors } from './src/theme';

// Chooses which screen to show. The menu data itself lives in MenuContext.
function AppContent() {
  const { addMenuItem } = useMenu();
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hide the confirmation banner a few seconds after it appears.
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleSaveMenuItem = (item: MenuItem) => {
    addMenuItem(item);
    setCurrentScreen('list');
    setSuccessMessage(`${item.dishName} has been added to the menu.`);

    if (Platform.OS !== 'web') {
      Alert.alert('Menu Item Added', `${item.dishName} was saved successfully.`);
    }
  };

  return currentScreen === 'list' ? (
    <MenuListScreen
      successMessage={successMessage}
      onAddPress={() => {
        setSuccessMessage(null);
        setCurrentScreen('add');
      }}
    />
  ) : (
    <MenuItemFormScreen onSave={handleSaveMenuItem} onCancel={() => setCurrentScreen('list')} />
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
