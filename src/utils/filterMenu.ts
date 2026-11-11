// Applies the course filter and the search text to the menu list.
import { CourseFilter, MenuItem } from '../types';

// Search looks at the dish name first, as the brief asks, and also checks the description
// so a chef searching "chocolate" still finds "Fondant" if chocolate is in the description.
export function matchesSearch(item: MenuItem, searchText: string): boolean {
  const query = searchText.trim().toLowerCase();
  if (query.length === 0) return true;
  return item.dishName.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
}

export function filterMenuItems(items: MenuItem[], course: CourseFilter, searchText: string): MenuItem[] {
  return items.filter(
    (item) => (course === 'All' || item.course === course) && matchesSearch(item, searchText),
  );
}
