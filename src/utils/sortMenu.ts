// Sorts the menu list in the order the chef picks.
import { MenuItem, SortOrder } from '../types';

export const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'Recently added', value: 'recent' },
  { label: 'Name (A to Z)', value: 'name' },
  { label: 'Price (low to high)', value: 'priceLow' },
  { label: 'Price (high to low)', value: 'priceHigh' },
];

export function getSortLabel(order: SortOrder): string {
  return SORT_OPTIONS.find((option) => option.value === order)?.label ?? '';
}

// Dishes saved before version 3 have no createdAt, so fall back to the time stored at the start of the id.
export function getCreatedTime(item: MenuItem): number {
  if (item.createdAt !== undefined) return item.createdAt;
  const fromId = parseInt(item.id.split('-')[0], 10);
  return Number.isNaN(fromId) ? 0 : fromId;
}

// Returns a new sorted array; the original menu is never changed.
export function sortMenuItems(items: MenuItem[], order: SortOrder): MenuItem[] {
  const sorted = [...items];

  switch (order) {
    case 'name':
      return sorted.sort((a, b) => a.dishName.localeCompare(b.dishName, undefined, { sensitivity: 'base' }));
    case 'priceLow':
      return sorted.sort((a, b) => a.price - b.price);
    case 'priceHigh':
      return sorted.sort((a, b) => b.price - a.price);
    case 'recent':
    default:
      return sorted.sort((a, b) => getCreatedTime(b) - getCreatedTime(a));
  }
}
