import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import { MenuItem } from '../types';

// All menu data lives here, so any screen can read or change it without passing props through App.

type MenuAction = { type: 'ADD'; item: MenuItem };

interface MenuState {
  items: MenuItem[];
}

function menuReducer(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case 'ADD':
      return { ...state, items: [...state.items, action.item] };
    default:
      return state;
  }
}

interface MenuContextValue {
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(menuReducer, { items: [] });

  const value: MenuContextValue = {
    menuItems: state.items,
    addMenuItem: (item) => dispatch({ type: 'ADD', item }),
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
