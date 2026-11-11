// Formatting helpers shared by every screen.

// Formats a price in South African Rand with a space between thousands,
// for example 185 becomes "R185.00" and 1250 becomes "R1 250.00".
export function formatPrice(price: number): string {
  const [rands, cents] = price.toFixed(2).split('.');
  const withSpaces = rands.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `R${withSpaces}.${cents}`;
}

// Chooses the singular or plural word for a count, for example "1 dish" or "3 dishes".
export function pluralise(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

// Turns a fraction into a whole percentage, for example 0.333 becomes "33%".
export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}
