// Works out the menu statistics shown on the Statistics screen and the home screen summary.
import { Course, MenuItem } from '../types';
import { COURSES } from '../constants/courses';

export interface CourseStats {
  course: Course;
  count: number;
  share: number; // fraction of the whole menu, from 0 to 1
  averagePrice: number | null; // null when the course has no dishes yet
}

export interface MenuStats {
  totalItems: number;
  averagePrice: number | null;
  highestPriced: MenuItem | null;
  lowestPriced: MenuItem | null;
  byCourse: CourseStats[];
}

export function averagePrice(items: MenuItem[]): number | null {
  if (items.length === 0) return null;
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return total / items.length;
}

export function getMenuStats(items: MenuItem[]): MenuStats {
  const byPrice = [...items].sort((a, b) => a.price - b.price);

  return {
    totalItems: items.length,
    averagePrice: averagePrice(items),
    lowestPriced: byPrice[0] ?? null,
    highestPriced: byPrice[byPrice.length - 1] ?? null,
    byCourse: COURSES.map((course) => {
      const courseItems = items.filter((item) => item.course === course);
      return {
        course,
        count: courseItems.length,
        share: items.length === 0 ? 0 : courseItems.length / items.length,
        averagePrice: averagePrice(courseItems),
      };
    }),
  };
}
