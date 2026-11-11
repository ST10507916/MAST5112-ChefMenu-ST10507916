import { averagePrice, getMenuStats } from '../menuStats';
import { sampleMenu } from './testData';

describe('getMenuStats', () => {
  const stats = getMenuStats(sampleMenu);

  it('counts the total number of menu items', () => {
    expect(stats.totalItems).toBe(4);
  });

  it('works out the average price of all menu items', () => {
    expect(stats.averagePrice).toBeCloseTo((65 + 185 + 245 + 55) / 4);
  });

  it('counts the menu items in each course', () => {
    const counts = Object.fromEntries(stats.byCourse.map((course) => [course.course, course.count]));
    expect(counts).toEqual({ Starter: 1, 'Main Course': 2, Dessert: 1 });
  });

  it('works out each course share and average price', () => {
    const mains = stats.byCourse.find((course) => course.course === 'Main Course');
    expect(mains?.share).toBe(0.5);
    expect(mains?.averagePrice).toBe(215);
  });

  it('finds the highest and lowest priced dishes', () => {
    expect(stats.highestPriced?.dishName).toBe('Fillet Steak');
    expect(stats.lowestPriced?.dishName).toBe('Malva Pudding');
  });

  it('handles an empty menu without errors', () => {
    const empty = getMenuStats([]);
    expect(empty.totalItems).toBe(0);
    expect(empty.averagePrice).toBeNull();
    expect(empty.highestPriced).toBeNull();
    expect(empty.byCourse.every((course) => course.count === 0 && course.averagePrice === null)).toBe(true);
  });
});

describe('averagePrice', () => {
  it('returns null when there are no dishes', () => {
    expect(averagePrice([])).toBeNull();
  });
});
