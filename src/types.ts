// Shared data types for the ChefMenu application.

// The three course options the chef can choose from (restricted list, as planned in Part 1).
export type Course = 'Starter' | 'Main Course' | 'Dessert';

// A single menu item record: dish name, description, course and price.
export interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  course: Course;
  price: number;
  createdAt?: number; // when the dish was added (used for "Recently added" sorting)
}

// The course filter on the menu list: one course, or every course.
export type CourseFilter = Course | 'All';

// The ways the chef can sort the menu list.
export type SortOrder = 'recent' | 'name' | 'priceLow' | 'priceHigh';

// The two main sections of the app, reached from the tab bar.
export type Tab = 'menu' | 'stats';

// The screen currently on display. Details and edit need to know which dish they are showing.
export type Route =
  | { name: 'list' }
  | { name: 'stats' }
  | { name: 'details'; itemId: string }
  | { name: 'form'; itemId?: string }; // no itemId means "add a new dish"
