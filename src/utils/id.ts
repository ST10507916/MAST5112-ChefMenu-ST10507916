// Creates a unique id for a new menu item, based on the current time plus a short random part.
export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
