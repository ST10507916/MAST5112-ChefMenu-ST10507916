// Course options and their display labels, kept in one place so every screen uses the same names.
import { Course, CourseFilter } from '../types';

export const COURSES: Course[] = ['Starter', 'Main Course', 'Dessert'];

// Plural labels used on the filter chips and the statistics screen (matching the Part 1 wireframe).
export const COURSE_PLURAL_LABELS: Record<Course, string> = {
  Starter: 'Starters',
  'Main Course': 'Mains',
  Dessert: 'Desserts',
};

export const COURSE_FILTERS: { label: string; value: CourseFilter }[] = [
  { label: 'All', value: 'All' },
  ...COURSES.map((course) => ({ label: COURSE_PLURAL_LABELS[course], value: course })),
];
