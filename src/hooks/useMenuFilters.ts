import { useMemo, useState } from 'react';
import { CourseFilter, MenuItem, SortOrder } from '../types';
import { filterMenuItems } from '../utils/filterMenu';
import { sortMenuItems } from '../utils/sortMenu';

// Holds the search text, course filter and sort order for the menu list, and works out which dishes to show.
// Keeping this in a hook means the screen only deals with layout.
export function useMenuFilters(menuItems: MenuItem[]) {
  const [searchText, setSearchText] = useState('');
  const [courseFilter, setCourseFilter] = useState<CourseFilter>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');

  const visibleItems = useMemo(
    () => sortMenuItems(filterMenuItems(menuItems, courseFilter, searchText), sortOrder),
    [menuItems, courseFilter, searchText, sortOrder],
  );

  // Sorting does not hide any dishes, so only search and filter count as "filtering".
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
    sortOrder,
    setSortOrder,
    visibleItems,
    isFiltering,
    clearFilters,
  };
}
