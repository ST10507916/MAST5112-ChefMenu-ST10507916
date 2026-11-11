import { filterMenuItems } from '../filterMenu';
import { getCreatedTime, sortMenuItems } from '../sortMenu';
import { sampleMenu } from './testData';

const names = (items: { dishName: string }[]) => items.map((item) => item.dishName);

describe('filterMenuItems', () => {
  it('returns every dish when there is no search or filter', () => {
    expect(filterMenuItems(sampleMenu, 'All', '')).toHaveLength(4);
  });

  it('searches by dish name, ignoring case', () => {
    expect(names(filterMenuItems(sampleMenu, 'All', 'KINGKLIP'))).toEqual(['Grilled Kingklip']);
  });

  it('filters by course', () => {
    expect(names(filterMenuItems(sampleMenu, 'Main Course', ''))).toEqual(['Grilled Kingklip', 'Fillet Steak']);
  });

  it('combines search and course filter', () => {
    expect(names(filterMenuItems(sampleMenu, 'Dessert', 'steak'))).toEqual([]);
  });
});

describe('sortMenuItems', () => {
  it('sorts by most recently added first', () => {
    expect(names(sortMenuItems(sampleMenu, 'recent'))[0]).toBe('Malva Pudding');
  });

  it('sorts by name A to Z', () => {
    expect(names(sortMenuItems(sampleMenu, 'name'))).toEqual([
      'Butternut Soup',
      'Fillet Steak',
      'Grilled Kingklip',
      'Malva Pudding',
    ]);
  });

  it('sorts by price both ways', () => {
    expect(sortMenuItems(sampleMenu, 'priceLow')[0].price).toBe(55);
    expect(sortMenuItems(sampleMenu, 'priceHigh')[0].price).toBe(245);
  });

  it('does not change the original menu', () => {
    const before = names(sampleMenu);
    sortMenuItems(sampleMenu, 'name');
    expect(names(sampleMenu)).toEqual(before);
  });

  it('reads the added time from the id for dishes saved before version 3', () => {
    expect(getCreatedTime({ ...sampleMenu[0], createdAt: undefined, id: '1700000000000-xyz' })).toBe(1700000000000);
  });
});
