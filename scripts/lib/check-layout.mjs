/**
 * layout.json checks: every section, nav and footer type exists, and every
 * config key is one the section reads (references/contract/section-schemas.json).
 */
const HEADING_KEYS = ["heading", "title"];

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function checkColorOverrides(overrides, allowed, where, errors) {
  if (overrides === undefined) return;
  if (!isRecord(overrides)) {
    errors.push(`${where}.colorOverrides: must be an object`);
    return;
  }
  for (const key of Object.keys(overrides)) {
    if (!allowed.includes(key)) errors.push(`${where}.colorOverrides.${key}: not a colour the runtime reads (${allowed.join(", ")})`);
  }
}

/** Icon names are matched without regard to case, as the platform does. */
function isKnownIcon(name, iconNames) {
  return iconNames.some((icon) => icon.toLowerCase() === String(name).trim().toLowerCase());
}

function checkField(field, value, where, errors, iconNames) {
  if (value === undefined || value === null) return;
  if (field.type === "icon" && iconNames && value !== "" && !isKnownIcon(value, iconNames)) {
    errors.push(`${where}.${field.key}: ${JSON.stringify(value)} is not an icon the platform has — see "Icons" in contract/component-catalog.md`);
  }
  if (field.type === "select" && field.options && !field.options.includes(String(value))) {
    errors.push(`${where}.${field.key}: ${JSON.stringify(value)} is not one of ${field.options.join(" | ")}`);
  }
  if ((field.type === "image" || field.type === "video") && value === "") {
    errors.push(`${where}.${field.key}: empty ${field.type} — supply a file or remove the key`);
  }
  if (field.type === "array" && Array.isArray(value) && field.itemFields) {
    value.forEach((item, index) => {
      if (!isRecord(item)) return;
      for (const itemField of field.itemFields) {
        checkField(itemField, item[itemField.key], `${where}.${field.key}[${index}]`, errors, iconNames);
      }
    });
  }
}

function checkSection(section, index, contract, errors) {
  const where = `layout.sections[${index}]`;
  const schema = contract.sections[section?.type];
  if (!schema) {
    errors.push(`${where}.type: ${JSON.stringify(section?.type)} is not a section type`);
    return;
  }
  if (typeof section.id !== "string" || section.id === "") errors.push(`${where}.id: every section needs an id`);
  const config = isRecord(section.config) ? section.config : {};
  const fields = new Map(schema.fields.map((field) => [field.key, field]));
  for (const [key, value] of Object.entries(config)) {
    const field = fields.get(key);
    if (field) checkField(field, value, `${where}.config`, errors, contract.iconNames);
    else if (!contract.commonSectionConfigKeys.includes(key)) {
      errors.push(`${where}.config.${key}: ${section.type} does not read this key`);
    }
  }
  if (config.density !== undefined && schema.ownsPadding) {
    errors.push(`${where}.config.density: ${section.type} keeps its own padding`);
  }
  checkColorOverrides(section.colorOverrides, contract.colorOverrideKeys, where, errors);
}

function checkChrome(layout, kind, contract, errors) {
  const typeKey = kind;
  const configKey = `${kind}Config`;
  const chrome = contract[kind];
  if (!chrome.types.includes(layout[typeKey])) {
    errors.push(`layout.${typeKey}: ${JSON.stringify(layout[typeKey])} is not one of ${chrome.types.join(" | ")}`);
  }
  const config = layout[configKey];
  if (config === undefined) return;
  if (!isRecord(config)) {
    errors.push(`layout.${configKey}: must be an object`);
    return;
  }
  for (const key of Object.keys(config)) {
    if (!chrome.configKeys.includes(key)) errors.push(`layout.${configKey}.${key}: the ${kind} does not read this key`);
  }
  checkColorOverrides(config.colorOverrides, contract.colorOverrideKeys, `layout.${configKey}`, errors);
  if (kind === "footer") {
    for (const key of ["partnerMark", "columnIcon"]) {
      if (config[key] !== undefined && !chrome[key].includes(config[key])) {
        errors.push(`layout.footerConfig.${key}: ${JSON.stringify(config[key])} is not one of ${chrome[key].join(" | ")}`);
      }
    }
  }
}

export function checkLayout(layout, contract, slug) {
  const errors = [];
  const warnings = [];
  if (!isRecord(layout)) return { errors: ["layout.json: must be an object"], warnings };

  checkChrome(layout, "navigation", contract, errors);
  checkChrome(layout, "footer", contract, errors);

  const sections = Array.isArray(layout.sections) ? layout.sections : [];
  if (sections.length === 0) errors.push("layout.sections: a template needs at least one section");
  sections.forEach((section, index) => checkSection(section, index, contract, errors));

  const ids = sections.map((section) => section?.id).filter(Boolean);
  const repeated = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (repeated.length > 0) errors.push(`layout.sections: ids must be unique — repeated: ${[...new Set(repeated)].join(", ")}`);

  const wrapperClass = layout.settings?.wrapperClass;
  if (wrapperClass !== `template-${slug}`) {
    errors.push(`layout.settings.wrapperClass: must be "template-${slug}", found ${JSON.stringify(wrapperClass)}`);
  }

  // Rubric items the layout alone can show. Warnings: a reviewer decides.
  const headed = sections.filter((section) => HEADING_KEYS.some((key) => contract.sections[section?.type]?.fields.some((field) => field.key === key)));
  const withEyebrow = headed.filter((section) => section.config?.eyebrow);
  if (headed.length > 0 && withEyebrow.length * 2 < headed.length) {
    warnings.push(`eyebrows: ${withEyebrow.length} of ${headed.length} headed sections have one — the rubric asks for at least half`);
  }
  const paddable = sections.filter((section) => contract.sections[section?.type] && !contract.sections[section.type].ownsPadding);
  const densities = new Set(paddable.map((section) => section.config?.density ?? contract.sections[section.type].defaultDensity));
  if (paddable.length >= 4 && densities.size < 2) {
    warnings.push("density: every section has the same density — the rubric asks for at least two");
  }
  if (sections.filter((section) => contract.sections[section?.type]?.category === "hero").length > 1) {
    warnings.push("heroes: more than one hero section");
  }
  return { errors, warnings };
}
