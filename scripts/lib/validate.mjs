/**
 * Validates one template directory against the platform's contract.
 *
 * A template is four files and an assets folder:
 *   layout.json  defaults.json  styles.css  template.config.json  assets/
 *
 * An ERROR is something the runtime would ignore or render badly; a template
 * with errors must not be uploaded. A WARNING is a quality-rubric item
 * (references/quality-rubric.md) for the reviewer to decide.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { checkCss } from "./check-css.mjs";
import { checkDesignSystem } from "./check-design-system.mjs";
import { checkLayout } from "./check-layout.mjs";

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,62}$/;
const ASSET_EXTENSION = /\.(png|jpe?g|webp|svg|gif|avif|mp4|webm)$/i;

function readJson(dir, name, errors) {
  const file = join(dir, name);
  if (!existsSync(file)) {
    errors.push(`${name}: missing`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(file, "utf-8"));
  } catch (error) {
    errors.push(`${name}: not valid JSON — ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

export function loadContract(contractDir) {
  const read = (name) => JSON.parse(readFileSync(join(contractDir, name), "utf-8"));
  return { sections: read("section-schemas.json"), designSystem: read("design-system.schema.json") };
}

/** Every string in `value` that names a file under assets/, with its path. */
function assetReferences(value, path, found = []) {
  if (typeof value === "string") {
    const trimmed = value.replace(/^\.?\//, "");
    if (trimmed.startsWith("assets/") && ASSET_EXTENSION.test(trimmed)) found.push({ path, file: trimmed });
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => assetReferences(item, `${path}[${index}]`, found));
  } else if (typeof value === "object" && value !== null) {
    for (const [key, child] of Object.entries(value)) assetReferences(child, `${path}.${key}`, found);
  }
  return found;
}

function checkAssets(dir, layout, defaults, errors) {
  const references = [...assetReferences(layout, "layout"), ...assetReferences(defaults, "defaults")];
  for (const { path, file } of references) {
    const target = join(dir, file);
    if (!existsSync(target) || !statSync(target).isFile()) errors.push(`${path}: ${file} is not in the template folder`);
  }
  for (const key of ["logoPath", "heroImagePath"]) {
    if (defaults && defaults[key] === "") errors.push(`defaults.${key}: empty — supply a file or remove the key`);
  }
}

export function validateTemplate(dir, contract) {
  const errors = [];
  const warnings = [];
  const config = readJson(dir, "template.config.json", errors);
  const layout = readJson(dir, "layout.json", errors);
  const defaults = readJson(dir, "defaults.json", errors);
  if (!config || !layout || !defaults) return { slug: null, errors, warnings };

  const slug = config.slug;
  if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
    errors.push(`template.config.json slug: ${JSON.stringify(slug)} — use lowercase letters, digits and hyphens`);
    return { slug: null, errors, warnings };
  }
  if (defaults.slug !== undefined && defaults.slug !== slug) {
    errors.push(`defaults.slug: ${JSON.stringify(defaults.slug)} does not match template.config.json slug "${slug}"`);
  }

  const cssFile = join(dir, "styles.css");
  const css = existsSync(cssFile) ? readFileSync(cssFile, "utf-8") : "";
  const results = [
    checkLayout(layout, contract.sections, slug),
    checkDesignSystem(defaults, layout, contract.sections, contract.designSystem),
    checkCss(css, slug),
  ];
  for (const result of results) {
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }
  checkAssets(dir, layout, defaults, errors);
  return { slug, errors, warnings };
}
