const KNOWN_BOX_FIELDS = new Set([
  'Reference',
  'Width',
  'Length',
  'Depth',
  'MaxWeight',
  'BoxWeight',
  'Active',
  'MaximumBoxes',
]);

const POSITIVE_FIELDS = ['Width', 'Length', 'Depth'];
const OPTIONAL_POSITIVE_FIELDS = ['MaxWeight', 'BoxWeight'];

export function validateBoxFields(
  raw,
  { label = 'Box', allowMissingMaximumBoxes = false } = {}
) {
  const errors = [];
  const prefix = `${label}: `;

  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return [`${prefix}record must be a JSON object.`];
  }

  const unknownFields = Object.keys(raw).filter((key) => !KNOWN_BOX_FIELDS.has(key));
  if (unknownFields.length > 0) {
    errors.push(`${prefix}unrecognised field(s): ${unknownFields.join(', ')}.`);
  }

  if (typeof raw.Reference !== 'string' || !raw.Reference.trim()) {
    errors.push(`${prefix}"Reference" is required and must be a non-empty string.`);
  }

  for (const field of POSITIVE_FIELDS) {
    const value = raw[field];
    const number = Number(value);
    if (value === undefined || value === null || value === '' || !Number.isFinite(number)) {
      errors.push(`${prefix}"${field}" is required and must be a number.`);
    } else if (number <= 0) {
      errors.push(`${prefix}"${field}" must be greater than 0.`);
    }
  }

  for (const field of OPTIONAL_POSITIVE_FIELDS) {
    const value = raw[field];
    if (value === undefined || value === null || value === '') continue;
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) {
      errors.push(`${prefix}"${field}" must be greater than 0 when supplied.`);
    }
  }

  if (
    raw.MaximumBoxes === undefined ||
    raw.MaximumBoxes === null ||
    raw.MaximumBoxes === ''
  ) {
    if (!allowMissingMaximumBoxes) {
      errors.push(`${prefix}"MaximumBoxes" is required and must be a whole number.`);
    }
  } else {
    const quantity = Number(raw.MaximumBoxes);
    if (!Number.isInteger(quantity) || quantity < 0) {
      errors.push(`${prefix}"MaximumBoxes" must be a whole number of 0 or more.`);
    }
  }

  if (typeof raw.Active !== 'boolean') {
    errors.push(`${prefix}"Active" is required and must be true or false.`);
  }

  return errors;
}

export function normaliseBox(raw) {
  const optionalNumber = (value) =>
    value === undefined || value === null || value === '' ? null : Number(value);

  return {
    Reference: raw.Reference.trim(),
    Width: Number(raw.Width),
    Length: Number(raw.Length),
    Depth: Number(raw.Depth),
    MaxWeight: optionalNumber(raw.MaxWeight),
    BoxWeight: optionalNumber(raw.BoxWeight),
    Active: raw.Active,
    // The established project fixture predates required inventory quantities.
    // Missing quantity is proposed visibly as out-of-stock during review.
    MaximumBoxes:
      raw.MaximumBoxes === undefined || raw.MaximumBoxes === null || raw.MaximumBoxes === ''
        ? 0
        : Number(raw.MaximumBoxes),
  };
}

export function parseBoxesJson(jsonText) {
  if (!jsonText || !jsonText.trim()) {
    return { boxes: null, errors: ['Paste or upload some box JSON first.'] };
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    return {
      boxes: null,
      errors: [`That doesn't look like valid JSON (${error.message}).`],
    };
  }

  const candidateBoxes = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray(parsed.Boxes)
      ? parsed.Boxes
      : null;

  if (!candidateBoxes) {
    return {
      boxes: null,
      errors: ['JSON must be an array of box records or an object with a "Boxes" array.'],
    };
  }
  if (candidateBoxes.length === 0) {
    return { boxes: null, errors: ['No box records found in the imported JSON.'] };
  }

  const errors = candidateBoxes.flatMap((box, index) =>
    validateBoxFields(box, {
      label: `Box ${index + 1}${box?.Reference ? ` (${box.Reference})` : ''}`,
      allowMissingMaximumBoxes: true,
    })
  );
  if (errors.length > 0) return { boxes: null, errors };

  const boxes = candidateBoxes.map(normaliseBox);
  const references = boxes.map((box) => box.Reference);
  const duplicates = [...new Set(references.filter(
    (reference, index) => references.indexOf(reference) !== index
  ))];
  if (duplicates.length > 0) {
    return {
      boxes: null,
      errors: [`Duplicate box Reference values in import: ${duplicates.join(', ')}.`],
    };
  }

  return { boxes, errors: [] };
}

export function validateImportResults(records, inventory) {
  if (records.length === 0) return ['Keep at least one box record before confirming.'];

  const errors = records.flatMap((record, index) => {
    const resultForFieldValidation = record.classification === 'EXISTING'
      ? { ...record.result, MaximumBoxes: 0 }
      : record.result;
    const recordErrors = validateBoxFields(resultForFieldValidation, {
      label: `Result ${index + 1}`,
    });
    if (record.classification === 'EXISTING') {
      const importedStock = Number(record.importedStock);
      if (!Number.isInteger(importedStock) || importedStock < 0) {
        recordErrors.push(
          `${record.result.Reference}: imported stock must be a whole number of 0 or more.`
        );
      }
      if (!record.stockOperation) {
        recordErrors.push(
          `${record.result.Reference}: choose Replace existing stock or Add to existing stock.`
        );
      }
    }
    return recordErrors;
  });
  const references = records.map((record) => String(record.result.Reference ?? '').trim());
  const duplicates = [...new Set(references.filter(
    (reference, index) => reference && references.indexOf(reference) !== index
  ))];
  if (duplicates.length > 0) {
    errors.push(`Result Reference values must be unique: ${duplicates.join(', ')}.`);
  }

  const existingReferences = new Set(inventory.map((box) => box.Reference));
  for (const record of records) {
    const resultReference = String(record.result.Reference ?? '').trim();
    if (record.classification === 'NEW' && existingReferences.has(resultReference)) {
      errors.push(
        `${resultReference} already exists. Remove it and import it as an existing record.`
      );
    }
  }

  return errors;
}
