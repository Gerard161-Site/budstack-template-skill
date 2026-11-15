/**
 * Unfilled scaffold text.
 *
 * references/page-content.md gives a `pageContent` scaffold whose values are
 * {{UPPER_CASE}} placeholders. The platform substitutes nothing at render
 * time, so one left in a template is shown to shoppers as written.
 */
const PLACEHOLDER = /\{\{[^{}]*\}\}/;

function collect(value, path, found) {
  if (typeof value === "string") {
    const match = value.match(PLACEHOLDER);
    if (match) found.push(`${path}: unfilled placeholder ${match[0]}`);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, `${path}[${index}]`, found));
  } else if (typeof value === "object" && value !== null) {
    for (const [key, child] of Object.entries(value)) collect(child, `${path}.${key}`, found);
  }
  return found;
}

/** @param {Record<string, unknown>} files  file label → parsed JSON */
export function checkPlaceholders(files) {
  const errors = Object.entries(files).flatMap(([label, json]) => collect(json, label, []));
  return { errors, warnings: [] };
}
