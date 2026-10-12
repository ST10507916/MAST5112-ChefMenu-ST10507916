// Validation rules for the menu item form, kept separate from the screen so they can be reused and tested.
import { Course } from '../types';

export interface MenuItemFormValues {
  dishName: string;
  description: string;
  course: Course | '';
  price: string;
}

// One optional error message per field. An empty object means the form is valid.
export type FormErrors = Partial<Record<keyof MenuItemFormValues, string>>;

export const MAX_NAME_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 200;

// Accepts "185,50" as well as "185.50".
export function normalisePrice(value: string): string {
  return value.trim().replace(',', '.');
}

// existingNames: the names of the other dishes on the menu, used to stop duplicates.
export function validateMenuItem(values: MenuItemFormValues, existingNames: string[] = []): FormErrors {
  const errors: FormErrors = {};
  const name = values.dishName.trim();
  const price = normalisePrice(values.price);

  if (name.length === 0) {
    errors.dishName = 'Please enter the dish name.';
  } else if (name.length < 2) {
    errors.dishName = 'The dish name must be at least 2 characters.';
  } else if (existingNames.some((existing) => existing.trim().toLowerCase() === name.toLowerCase())) {
    errors.dishName = `${name} is already on the menu. Please use a different name.`;
  }

  if (values.description.trim().length === 0) {
    errors.description = 'Please enter a short description of the dish.';
  }

  if (values.course === '') {
    errors.course = 'Please select a course: Starter, Main Course or Dessert.';
  }

  if (price.length === 0) {
    errors.price = 'Please enter the price.';
  } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
    errors.price = 'Enter a valid price using numbers only, for example 185 or 185.50.';
  } else if (parseFloat(price) <= 0) {
    errors.price = 'The price must be more than R0.00.';
  }

  return errors;
}

export function countErrors(errors: FormErrors): number {
  return Object.values(errors).filter(Boolean).length;
}
