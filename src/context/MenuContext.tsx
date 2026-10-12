import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuItem } from '../types';

// All menu data lives here, so any screen can read or change it without passing props through App.
// The menu is also saved to the device, so it is still there after the app is closed.

const STORAGE_KEY = '@chefmenu/menu-items';

type MenuAction =
  | { type: 'LOAD'; items: MenuItem[] }
  | { type: 'ADD'; item: MenuItem }
  | { type: 'UPDATE'; item: MenuItem }
  | { type: 'DELETE'; id: string };

interface MenuState {
  items: MenuItem[];
  isLoaded: boolean; // false until the saved menu has been read from storage
}

function menuReducer(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case 'LOAD':
      return { items: action.items, isLoaded: true };
    case 'ADD':
      return { ...state, items: [...state.items, action.item] };
    case 'UPDATE':
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.item.id ? action.item : item)),
      };
    case 'DELETE':
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    default:
      return state;
  }
}

interface MenuContextValue {
  menuItems: MenuItem[];
  isLoaded: boolean;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  getMenuItem: (id: string) => MenuItem | undefined;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(menuReducer, { items: [], isLoaded: false });

  // Read the saved menu once when the app starts.
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        dispatch({ type: 'LOAD', items: saved ? (JSON.parse(saved) as MenuItem[]) : [] });
      } catch {
        // If storage cannot be read, start with an empty menu instead of crashing.
        dispatch({ type: 'LOAD', items: [] });
      }
    };
    loadMenu();
  }, []);

  // Save the menu every time it changes (only after the first load, so an empty list never overwrites saved data).
  useEffect(() => {
    if (!state.isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(() => {
      // Saving is best effort; the menu still works for this session.
    });
  }, [state.items, state.isLoaded]);

  const value: MenuContextValue = {
    menuItems: state.items,
    isLoaded: state.isLoaded,
    addMenuItem: (item) => dispatch({ type: 'ADD', item }),
    updateMenuItem: (item) => dispatch({ type: 'UPDATE', item }),
    deleteMenuItem: (id) => dispatch({ type: 'DELETE', id }),
    getMenuItem: (id) => state.items.find((item) => item.id === id),
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuContextValue {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used inside a MenuProvider.');
  }
  return context;
}
