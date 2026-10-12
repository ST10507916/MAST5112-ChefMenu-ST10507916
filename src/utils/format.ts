// Formatting helpers shared by every screen.

// Formats a price in South African Rand, for example 185 becomes "R185.00".
export function formatPrice(price: number): string {
  return `R${price.toFixed(2)}`;
}
