// Shared data types for the ChefMenu application.

// The three course options the chef can choose from (restricted list, as planned in Part 1).
export type Course = 'Starter' | 'Main Course' | 'Dessert';

export const COURSES: Course[] = ['Starter', 'Main Course', 'Dessert'];

// A single menu item record: dish name, description, course and price.
export interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  course: Course;
  price: number;
}

// The screens the app can show in this version.
export type Screen = 'list' | 'add';
