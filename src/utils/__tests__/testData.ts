import { MenuItem } from '../../types';

// A small sample menu shared by the tests.
export const sampleMenu: MenuItem[] = [
  { id: '1000-a', dishName: 'Butternut Soup', description: 'Roasted butternut soup with cream.', course: 'Starter', price: 65, createdAt: 1000 },
  { id: '2000-b', dishName: 'Grilled Kingklip', description: 'Line-caught kingklip with lemon butter.', course: 'Main Course', price: 185, createdAt: 2000 },
  { id: '3000-c', dishName: 'Fillet Steak', description: 'Aged fillet with pepper sauce and chips.', course: 'Main Course', price: 245, createdAt: 3000 },
  { id: '4000-d', dishName: 'Malva Pudding', description: 'Warm sticky pudding with custard.', course: 'Dessert', price: 55, createdAt: 4000 },
];
