/**
 * A JSON Schema checker for the one schema this skill validates:
 * references/contract/design-system.schema.json.
 *
 * It implements exactly the keywords that file uses — type (object, string),
 * properties, required, additionalProperties: false, const, enum, pattern,
 * minLength, maxLength and not.pattern — and throws on any other, so a keyword
 * the platform starts using cannot be silently ignored.
 */
const KNOWN_KEYWORDS = new Set([
  "$schema",
  "title",
  "description",
  "type",
  "properties",
  "required",
  "additionalProperties",
  "const",
  "enum",
  "pattern",
  "minLength",
  "maxLength",
  "not",
]);

function describe(value) {
  return typeof value === "string" ? JSON.stringify(value) : JSON.stringify(value) ?? String(value);
}

function checkString(schema, value, path, errors) {
  if (typeof value !== "string") {
    errors.push(`${path}: must be a string, found ${describe(value)}`);
    return;
  }
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path}: ${describe(value)} is not one of ${schema.enum.join(" | ")}`);
  }
  if (schema.minLength !== undefined && value.length < schema.minLength) {
    errors.push(`${path}: must not be empty`);
  }
  if (schema.maxLength !== undefined && value.length > schema.maxLength) {
    errors.push(`${path}: longer than ${schema.maxLength} characters`);
  }
  if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
    errors.push(`${path}: ${describe(value)} does not match ${schema.pattern}`);
  }
  if (schema.not?.pattern && new RegExp(schema.not.pattern, "i").test(value)) {
    errors.push(`${path}: ${describe(value)} contains characters that are not allowed here`);
  }
}

function checkObject(schema, value, path, errors) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    errors.push(`${path}: must be an object, found ${describe(value)}`);
    return;
  }
  const properties = schema.properties ?? {};
  for (const key of schema.required ?? []) {
    if (value[key] === undefined) errors.push(`${path}.${key}: required`);
  }
  for (const [key, child] of Object.entries(value)) {
    if (properties[key]) {
      validateJsonSchema(properties[key], child, `${path}.${key}`, errors);
    } else if (schema.additionalProperties === false) {
      errors.push(`${path}.${key}: not read by the runtime — remove it`);
    }
  }
}

/** Collects one message per violation into `errors` and returns it. */
export function validateJsonSchema(schema, value, path = "designSystem", errors = []) {
  for (const keyword of Object.keys(schema)) {
    if (!KNOWN_KEYWORDS.has(keyword)) {
      throw new Error(`json-schema: keyword "${keyword}" at ${path} is not supported by this validator`);
    }
  }
  if (schema.const !== undefined) {
    if (value !== schema.const) errors.push(`${path}: must be ${describe(schema.const)}, found ${describe(value)}`);
    return errors;
  }
  if (schema.type === "object") checkObject(schema, value, path, errors);
  else if (schema.type === "string") checkString(schema, value, path, errors);
  else throw new Error(`json-schema: type "${schema.type}" at ${path} is not supported by this validator`);
  return errors;
}
