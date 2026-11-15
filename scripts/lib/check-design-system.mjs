/**
 * defaults.json checks: the design system matches the platform's schema
 * (references/contract/design-system.schema.json), its fonts are loaded, and
 * its colours can be read.
 */
import { AA_TEXT, contrastRatio, derivedSurface, readableOn } from "./contrast.mjs";
import { validateJsonSchema } from "./json-schema.mjs";

const SYSTEM_FAMILIES = new Set([
  "system-ui", "-apple-system", "blinkmacsystemfont", "segoe ui", "roboto", "helvetica", "helvetica neue",
  "arial", "sans-serif", "serif", "monospace", "cursive", "georgia", "times new roman", "times",
  "impact", "arial black", "ui-sans-serif", "ui-serif", "ui-monospace", "courier new",
]);

function primaryFamily(stack) {
  return stack.split(",")[0].trim().replace(/^["']|["']$/g, "");
}

/** Families named in a Google Fonts css2 URL, lower-cased. */
function loadedFamilies(googleFontsUrl) {
  if (typeof googleFontsUrl !== "string") return new Set();
  return new Set(
    [...googleFontsUrl.matchAll(/family=([^:&]+)/g)].map((match) => decodeURIComponent(match[1].replace(/\+/g, " ")).toLowerCase()),
  );
}

function checkFonts(designSystem, googleFontsUrl, fontCatalog, errors, warnings) {
  const fontFamily = designSystem?.typography?.fontFamily;
  if (typeof fontFamily !== "object" || fontFamily === null) return;
  const loaded = loadedFamilies(googleFontsUrl);
  const catalogNames = new Map(fontCatalog.map((font) => [font.id, font.name]));
  const families = new Set();
  for (const role of ["body", "heading", "accent"]) {
    const value = fontFamily[role];
    if (typeof value !== "string" || value.trim() === "") continue;
    const isId = catalogNames.has(value.trim());
    const family = isId ? catalogNames.get(value.trim()) : primaryFamily(value);
    if (role !== "accent") families.add(family.toLowerCase());
    if (SYSTEM_FAMILIES.has(family.toLowerCase())) continue;
    // A catalogue id is loaded by the platform, but only when the layout sets
    // no googleFontsUrl of its own.
    if (isId && !googleFontsUrl) continue;
    if (!loaded.has(family.toLowerCase())) {
      errors.push(`designSystem.typography.fontFamily.${role}: "${family}" is not in layout.settings.googleFontsUrl, so it will not load`);
    }
  }
  if (families.size > 2) warnings.push(`fonts: ${families.size} families for body and heading — the rubric allows two, plus one accent`);
}

function pair(name, foreground, background, where, errors) {
  const ratio = contrastRatio(foreground, background);
  if (ratio !== null && ratio < AA_TEXT) {
    errors.push(`${where}: ${name} contrast is ${ratio.toFixed(2)}:1 — needs ${AA_TEXT}:1 (${foreground} on ${background})`);
  }
}

/** The pairs a storefront actually renders, for one palette. */
export function checkPalette(colors, where, errors) {
  const background = colors.background;
  const surface = colors.surface ?? derivedSurface(background);
  pair("text on background", colors.text, background, where, errors);
  pair("heading on background", colors.heading, background, where, errors);
  pair("text on surface", colors.text, surface, where, errors);
  pair("heading on surface", colors.heading, surface, where, errors);
  if (colors.primary) pair("button label on primary", readableOn(colors.primary), colors.primary, where, errors);
}

function checkTypeSizes(designSystem, warnings) {
  const hero = Number(designSystem?.typography?.fontSize?.hero ?? 60);
  const section = Number(designSystem?.typography?.fontSize?.section ?? 40);
  if (hero < 56 || hero > 72) warnings.push(`type: hero size ${hero}px — the rubric asks for 56 to 72`);
  if (section < 36 || section > 48) warnings.push(`type: section heading size ${section}px — the rubric asks for 36 to 48`);
}

export function checkDesignSystem(defaults, layout, contract, schema) {
  const errors = [];
  const warnings = [];
  const designSystem = defaults?.designSystem;
  if (typeof designSystem !== "object" || designSystem === null) {
    return { errors: ["defaults.designSystem: missing"], warnings };
  }
  if (designSystem.schemaVersion !== contract.designSystemVersion) {
    errors.push(`designSystem.schemaVersion: must be ${contract.designSystemVersion} — this template is not on Template Design System v2`);
  }
  // The version has its own, plainer message above.
  const schemaErrors = validateJsonSchema(schema, designSystem).filter(
    (message) => !message.startsWith("designSystem.schemaVersion:"),
  );
  errors.push(...schemaErrors);
  if (schemaErrors.length > 0) return { errors, warnings };

  checkFonts(designSystem, layout?.settings?.googleFontsUrl, contract.fontCatalog, errors, warnings);
  checkPalette(designSystem.colors, "designSystem.colors", errors);
  checkTypeSizes(designSystem, warnings);

  const overrides = [
    ...(Array.isArray(layout?.sections) ? layout.sections : []).map((section, index) => [`layout.sections[${index}].colorOverrides`, section?.colorOverrides]),
    ["layout.navigationConfig.colorOverrides", layout?.navigationConfig?.colorOverrides],
    ["layout.footerConfig.colorOverrides", layout?.footerConfig?.colorOverrides],
  ];
  for (const [where, override] of overrides) {
    if (typeof override !== "object" || override === null) continue;
    for (const [key, value] of Object.entries(override)) {
      if (typeof value !== "string" || !/^\d{1,3}(\.\d+)?\s+\d{1,3}(\.\d+)?%\s+\d{1,3}(\.\d+)?%$/.test(value)) {
        errors.push(`${where}.${key}: must be raw HSL channels, e.g. "178 48% 21%"`);
      }
    }
    checkPalette({ ...designSystem.colors, ...override }, where, errors);
  }
  return { errors, warnings };
}
