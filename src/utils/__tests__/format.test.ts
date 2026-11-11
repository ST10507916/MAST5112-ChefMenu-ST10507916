import { formatPercent, formatPrice, pluralise } from '../format';

describe('formatPrice', () => {
  it.each([
    [185, 'R185.00'],
    [55.5, 'R55.50'],
    [1250, 'R1 250.00'],
    [10000, 'R10 000.00'],
  ])('formats %p as %s', (price, expected) => {
    expect(formatPrice(price)).toBe(expected);
  });
});

describe('pluralise and formatPercent', () => {
  it('uses the right word for the count', () => {
    expect(pluralise(1, 'dish', 'dishes')).toBe('1 dish');
    expect(pluralise(3, 'dish', 'dishes')).toBe('3 dishes');
  });

  it('rounds a fraction to a whole percentage', () => {
    expect(formatPercent(1 / 3)).toBe('33%');
  });
});
