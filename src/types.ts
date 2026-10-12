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

// The course filter on the menu list: one course, or every course.
export type CourseFilter = Course | 'All';

// The screen currently on display. Details and edit need to know which dish they are showing.
export type Route =
  | { name: 'list' }
  | { name: 'details'; itemId: string }
  | { name: 'form'; itemId?: string }; // no itemId means "add a new dish"
