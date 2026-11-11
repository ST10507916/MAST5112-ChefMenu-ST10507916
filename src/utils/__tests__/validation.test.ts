import { cleanText, countErrors, normalisePrice, validateField, validateMenuItem } from '../validation';

const validForm = {
  dishName: 'Bobotie',
  description: 'Spiced mince bake with egg custard topping.',
  course: 'Main Course' as const,
  price: '145.50',
};

describe('validateMenuItem', () => {
  it('accepts a complete, valid dish', () => {
    expect(validateMenuItem(validForm)).toEqual({});
  });

  it('flags every empty field', () => {
    const errors = validateMenuItem({ dishName: '', description: '', course: '', price: '' });
    expect(countErrors(errors)).toBe(4);
  });

  it('rejects a duplicate dish name, ignoring case and extra spaces', () => {
    const errors = validateMenuItem({ ...validForm, dishName: '  bobotie ' }, ['Bobotie']);
    expect(errors.dishName).toContain('already on the menu');
  });

  it('rejects a name made only of numbers', () => {
    expect(validateMenuItem({ ...validForm, dishName: '123' }).dishName).toContain('at least one letter');
  });

  it('rejects a description shorter than 10 characters', () => {
    expect(validateMenuItem({ ...validForm, description: 'Nice' }).description).toContain('at least 10');
  });

  it.each(['abc', '12.345', '-5', '1.2.3'])('rejects the invalid price "%s"', (price) => {
    expect(validateMenuItem({ ...validForm, price }).price).toBeDefined();
  });

  it('rejects a price of zero and a price above R10 000', () => {
    expect(validateMenuItem({ ...validForm, price: '0' }).price).toContain('more than R0.00');
    expect(validateMenuItem({ ...validForm, price: '10000.01' }).price).toContain('R10 000.00');
  });

  it('accepts a comma as the decimal separator', () => {
    expect(validateMenuItem({ ...validForm, price: '145,50' }).price).toBeUndefined();
  });
});

describe('validateField', () => {
  it('returns only the error for the field asked about', () => {
    const values = { ...validForm, price: 'abc', description: 'x' };
    expect(validateField('price', values)).toContain('valid price');
    expect(validateField('dishName', values)).toBeUndefined();
  });
});

describe('helpers', () => {
  it('normalisePrice swaps a comma for a dot', () => {
    expect(normalisePrice(' 85,5 ')).toBe('85.5');
  });

  it('cleanText trims and collapses spaces', () => {
    expect(cleanText('  Malva   Pudding ')).toBe('Malva Pudding');
  });
});
