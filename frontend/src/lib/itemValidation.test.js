import { describe, expect, it } from 'vitest';
import { ITEM_TEXT_LIMITS, normaliseItem, parseItemsJson, validateItemFields } from './itemValidation.js';

const ITEM = {
  ItemCode: 'ITM-001',
  ItemReference: 'Widget A',
  Width: 100,
  Length: 200,
  Depth: 50,
  Weight: 1,
};

describe('ItemCode', () => {
  it.each(['ITM-001', 'ABC', '12', 'PART-123-A', 'ROD-A'])('accepts %s unchanged', (code) => {
    const item = { ...ITEM, ItemCode: code };

    expect(validateItemFields(item)).toEqual([]);
    expect(normaliseItem(item).ItemCode).toBe(code);
  });

  it('trims surrounding whitespace', () => {
    expect(normaliseItem({ ...ITEM, ItemCode: '  ABC  ' }).ItemCode).toBe('ABC');
  });

  it.each(['', '   '])('rejects a blank code %j', (code) => {
    expect(validateItemFields({ ...ITEM, ItemCode: code })).toEqual([
      '"ItemCode" is required and must be a non-empty string.',
    ]);
  });

  it('accepts client item files with their own codes', () => {
    const parsed = parseItemsJson(JSON.stringify([
      { ...ITEM, ItemCode: 'BOOK', Quantity: 38 },
      { ...ITEM, ItemCode: 'TILE-XL', BoxGroup: 'FOOD' },
    ]));

    expect(parsed.errors).toEqual([]);
    expect(parsed.items.map((item) => item.ItemCode)).toEqual(['BOOK', 'TILE-XL']);
  });
});

describe('item weight limit', () => {
  it('keeps the 32 kg limit', () => {
    expect(validateItemFields({ ...ITEM, Weight: 32 })).toEqual([]);
    expect(validateItemFields({ ...ITEM, Weight: 32.01 })[0]).toMatch('exceeds the maximum');
  });
});

describe.each(Object.entries(ITEM_TEXT_LIMITS))('%s character limit', (field, limit) => {
  it.each(['A', '😀'])('accepts exactly the limit after trimming, including %s characters', (character) => {
    const value = character.repeat(limit);
    const item = { ...ITEM, [field]: `  ${value}  ` };

    expect(validateItemFields(item)).toEqual([]);
    expect(normaliseItem(item)[field]).toBe(value);
    const imported = parseItemsJson(JSON.stringify({ Items: [item] }));
    expect(imported.errors).toEqual([]);
    expect(imported.items[0][field]).toBe(value);
  });

  it.each(['A', '😀'])('rejects overlong %s text for both manual entry and JSON import', (character) => {
    const item = { ...ITEM, [field]: character.repeat(limit + 1) };

    expect(validateItemFields(item)).toEqual([`"${field}" must be ${limit} characters or fewer.`]);
    const imported = parseItemsJson(JSON.stringify([ITEM, item]));
    expect(imported.items).toBeNull();
    expect(imported.errors).toHaveLength(1);
    expect(imported.errors[0]).toContain('Item 2');
    expect(imported.errors[0]).toContain(`"${field}" must be ${limit} characters or fewer.`);
  });
});

describe('client item schema', () => {
  const CLIENT_ITEMS = [
    {
      ItemCode: 'ACID',
      ItemReference: 'Acid Bottle (boxed)',
      Width: 100,
      Length: 100,
      Depth: 200,
      Weight: 1.9,
      Quantity: 8,
      BoxGroup: 'CORROSIVE',
    },
    {
      ItemCode: 'BOOK',
      ItemReference: 'Hardback Book',
      Width: 160,
      Length: 100,
      Depth: 100,
      Weight: 0.5,
      Quantity: 38,
    },
  ];

  it('imports client items with BoxGroup and no Hazardous field unchanged', () => {
    const parsed = parseItemsJson(JSON.stringify(CLIENT_ITEMS));

    expect(parsed.errors).toEqual([]);
    expect(parsed.items).toEqual(CLIENT_ITEMS);
  });

  it('rejects Hazardous as an unrecognised field', () => {
    expect(validateItemFields({ ...ITEM, Hazardous: true })).toEqual([
      'Unrecognised field(s): Hazardous.',
    ]);
  });

  it('never adds a Hazardous value to a normalised item', () => {
    expect(normaliseItem(ITEM)).not.toHaveProperty('Hazardous');
  });
});
