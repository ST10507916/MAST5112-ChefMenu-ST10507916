// Applies the course filter and the search text to the menu list.
import { CourseFilter, MenuItem } from '../types';

export function filterMenuItems(items: MenuItem[], course: CourseFilter, searchText: string): MenuItem[] {
  const query = searchText.trim().toLowerCase();

  return items.filter((item) => {
    const matchesCourse = course === 'All' || item.course === course;
    const matchesSearch =
      query.length === 0 ||
      item.dishName.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    return matchesCourse && matchesSearch;
  });
}
