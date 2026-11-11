import { useMemo, useState } from 'react';
import { CourseFilter, MenuItem } from '../types';
import { filterMenuItems } from '../utils/filterMenu';

// Holds the search text and course filter for the menu list, and works out which dishes to show.
// Keeping this in a hook means the screen only deals with layout.
export function useMenuFilters(menuItems: MenuItem[]) {
  const [searchText, setSearchText] = useState('');
  const [courseFilter, setCourseFilter] = useState<CourseFilter>('All');

  const visibleItems = useMemo(
    () => filterMenuItems(menuItems, courseFilter, searchText),
    [menuItems, courseFilter, searchText],
  );

  const isFiltering = searchText.trim().length > 0 || courseFilter !== 'All';

  const clearFilters = () => {
    setSearchText('');
    setCourseFilter('All');
  };

  return {
    searchText,
    setSearchText,
    courseFilter,
    setCourseFilter,
    visibleItems,
    isFiltering,
    clearFilters,
  };
}
