// Works out the menu statistics shown on the home screen.
import { COURSES, Course, MenuItem } from '../types';

export interface CourseStats {
  course: Course;
  count: number;
  averagePrice: number | null; // null when the course has no dishes yet
}

export interface MenuStats {
  totalItems: number;
  averagePrice: number | null;
  byCourse: CourseStats[];
}

function average(prices: number[]): number | null {
  if (prices.length === 0) return null;
  const total = prices.reduce((sum, price) => sum + price, 0);
  return total / prices.length;
}

export function getMenuStats(items: MenuItem[]): MenuStats {
  return {
    totalItems: items.length,
    averagePrice: average(items.map((item) => item.price)),
    byCourse: COURSES.map((course) => {
      const prices = items.filter((item) => item.course === course).map((item) => item.price);
      return { course, count: prices.length, averagePrice: average(prices) };
    }),
  };
}
